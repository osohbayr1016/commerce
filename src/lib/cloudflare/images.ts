interface CloudflareImageUploadResponse {
  success: boolean;
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  errors: Array<{ code: number; message: string }>;
}

interface CloudflareImageResponse {
  success: boolean;
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  errors: Array<{ code: number; message: string }>;
}

function getEnvVar(name: string, env?: Record<string, any>): string | undefined {
  if (env && env[name]) {
    return env[name];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  return undefined;
}

function getCloudflareConfig(env?: Record<string, any>) {
  const accountIdRaw = getEnvVar('CLOUDFLARE_ACCOUNT_ID', env);
  const apiTokenRaw = getEnvVar('CLOUDFLARE_IMAGES_API_TOKEN', env);
  const accountId = accountIdRaw?.trim();
  const apiToken = apiTokenRaw?.trim();
  const missing = [];
  if (!accountId) missing.push('CLOUDFLARE_ACCOUNT_ID');
  if (!apiToken) missing.push('CLOUDFLARE_IMAGES_API_TOKEN');
  
  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please configure these in Cloudflare Workers dashboard under Settings → Variables and Secrets. ` +
      `For local development, add them to .env.local file.`;
    throw new Error(errorMsg);
  }
  
  const validatedAccountId = accountId!;
  let validatedApiToken = apiToken!;
  validatedApiToken = validatedApiToken.trim().replace(/[\s\r\n\t]/g, '');
  
  if (validatedApiToken.length === 0) {
    throw new Error('CLOUDFLARE_IMAGES_API_TOKEN is empty after cleaning. Please check the token value.');
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(validatedAccountId)) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID has invalid format. Please verify the account ID.');
  }
  
  return {
    accountId: validatedAccountId,
    apiToken: validatedApiToken,
    apiBase: `https://api.cloudflare.com/client/v4/accounts/${validatedAccountId}/images/v1`,
  };
}

function validateTokenFormat(token: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (token.length < 30) {
    issues.push(`Token appears too short (${token.length} chars). Cloudflare tokens are typically 40+ characters.`);
  }
  if (token.includes(' ') && !token.trim().includes(' ')) {
    issues.push('Token may have leading/trailing whitespace (will be trimmed).');
  }
  if (token.includes('\n') || token.includes('\r')) {
    issues.push('Token contains newline characters which are invalid.');
  }
  return {
    valid: issues.length === 0,
    issues,
  };
}

async function verifyCloudflareToken(config: { accountId: string; apiToken: string; apiBase: string }): Promise<{ valid: boolean; error?: string; warning?: string }> {
  try {
    const imagesTestResponse = await fetch(`${config.apiBase}?per_page=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const testData = await imagesTestResponse.json().catch(() => null);
    if (imagesTestResponse.status === 403) {
      return {
        valid: false,
        error: 'API token does not have Cloudflare Images permissions. ' +
          'Please create a new token with: Account → Cloudflare Images → Edit permission. ' +
          'Make sure the token includes your account ID in Account Resources.',
      };
    }
    if (imagesTestResponse.status === 401) {
      return {
        valid: false,
        error: 'API token is invalid or expired. Please create a new token in Cloudflare Dashboard.',
      };
    }
    if (imagesTestResponse.ok) {
      return { valid: true };
    }
    return { valid: true, warning: `Token verification returned status ${imagesTestResponse.status}` };
  } catch (error) {
    return { valid: true, warning: 'Could not verify token, but proceeding with upload attempt' };
  }
}

export async function uploadImageToCloudflare(
  file: File,
  env?: Record<string, any>
): Promise<{ id: string; url: string; variants: string[] }> {
  const config = getCloudflareConfig(env);
  const tokenValidation = validateTokenFormat(config.apiToken);
  if (!tokenValidation.valid) {
  }
  const tokenVerification = await verifyCloudflareToken(config);
  if (!tokenVerification.valid && tokenVerification.error) {
    throw new Error(
      `Token verification failed: ${tokenVerification.error}\n\n` +
      `To fix this:\n` +
      `1. Go to https://dash.cloudflare.com/profile/api-tokens\n` +
      `2. Click "Create Token"\n` +
      `3. Use "Edit Cloudflare Images" template OR create custom token with:\n` +
      `   - Permission: Account → Cloudflare Images → Edit\n` +
      `   - Account Resources: Include → Specific account → ${config.accountId}\n` +
      `4. Copy the new token and update it in Cloudflare Workers Variables and Secrets`
    );
  }
  
  if (tokenVerification.warning) {
  }

  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided. Expected File object.');
  }

  if (file.size === 0) {
    throw new Error('File is empty');
  }

  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  let responseData: any;

  try {
    const cleanToken = config.apiToken.trim();
    const authHeader = `Bearer ${cleanToken}`;
    const headers: HeadersInit = {
      'Authorization': authHeader,
      'Accept': 'application/json',
    };
    
    response = await fetch(config.apiBase, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    responseData = await response.json().catch(() => null);
  } catch (fetchError) {
    const errorMsg = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
    throw new Error(`Failed to connect to Cloudflare Images API: ${errorMsg}`);
  }

  if (!response.ok) {
    const errorMessage = responseData?.errors?.[0]?.message || response.statusText;
    const errorCode = responseData?.errors?.[0]?.code || response.status;
    
    if (response.status === 403 || errorCode === 10000) {
      const fullErrorDetails = responseData?.errors || [];
      const specificError = fullErrorDetails.find((e: any) => e.message && e.message !== 'Authentication error');
      const detailedMessage = specificError?.message || errorMessage;
      
      throw new Error(
        `Cloudflare Images authentication failed (${errorCode}): ${detailedMessage}. ` +
        `Please verify: 1) API token has 'Account' → 'Cloudflare Images' → 'Edit' permission, ` +
        `2) Token is for the correct account (${config.accountId}), ` +
        `3) Token is not expired or revoked. ` +
        `Token length: ${config.apiToken.length} characters.`
      );
    }
    
    throw new Error(
      `Cloudflare Images API error (${errorCode}): ${errorMessage}`
    );
  }

  const data: CloudflareImageUploadResponse = responseData;

  if (!data.success || !data.result) {
    const errorMessage = data.errors?.[0]?.message || 'Unknown error from Cloudflare';
    throw new Error(`Cloudflare Images upload failed: ${errorMessage}`);
  }

  const imageId = data.result.id;
  const variants = data.result.variants;
  const url = variants[0] || getImageUrl(imageId, 'public', env);

  return {
    id: imageId,
    url,
    variants,
  };
}

export function getImageUrl(
  imageId: string,
  variant: string = 'public',
  env?: Record<string, any>
): string {
  const accountId = getEnvVar('CLOUDFLARE_ACCOUNT_ID', env);
  
  if (!accountId) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID environment variable not configured');
  }

  return `https://imagedelivery.net/${accountId}/${imageId}/${variant}`;
}

export async function deleteImageFromCloudflare(
  imageId: string,
  env?: Record<string, any>
): Promise<void> {
  const config = getCloudflareConfig(env);

  const response = await fetch(`${config.apiBase}/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${config.apiToken.trim()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.errors?.[0]?.message || response.statusText;
    throw new Error(`Failed to delete image: ${errorMessage}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to delete image from Cloudflare'
    );
  }
}

export async function getImageInfo(
  imageId: string,
  env?: Record<string, any>
): Promise<CloudflareImageResponse['result']> {
  const config = getCloudflareConfig(env);

  const response = await fetch(`${config.apiBase}/${imageId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.apiToken.trim()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.errors?.[0]?.message || response.statusText;
    throw new Error(`Failed to get image info: ${errorMessage}`);
  }

  const data: CloudflareImageResponse = await response.json();

  if (!data.success || !data.result) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to get image info from Cloudflare'
    );
  }

  return data.result;
}
