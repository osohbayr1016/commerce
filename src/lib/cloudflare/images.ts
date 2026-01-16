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

// Helper function to get environment variables from multiple sources
// Supports both local development (process.env) and Cloudflare Workers (env object)
function getEnvVar(name: string, env?: Record<string, any>): string | undefined {
  // Try Cloudflare env object first (if provided)
  if (env && env[name]) {
    return env[name];
  }
  
  // Fall back to process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  
  return undefined;
}

function getCloudflareConfig(env?: Record<string, any>) {
  const accountIdRaw = getEnvVar('CLOUDFLARE_ACCOUNT_ID', env);
  const apiTokenRaw = getEnvVar('CLOUDFLARE_IMAGES_API_TOKEN', env);
  
  // Trim whitespace and validate
  const accountId = accountIdRaw?.trim();
  const apiToken = apiTokenRaw?.trim();
  
  const missing = [];
  if (!accountId) missing.push('CLOUDFLARE_ACCOUNT_ID');
  if (!apiToken) missing.push('CLOUDFLARE_IMAGES_API_TOKEN');
  
  if (missing.length > 0) {
    // Log for debugging (without exposing values)
    console.error('Cloudflare Images configuration error:', {
      missingVars: missing,
      hasAccountId: !!accountId,
      hasApiToken: !!apiToken,
      envProvided: !!env,
      processEnvAvailable: typeof process !== 'undefined' && !!process.env,
    });
    
    const errorMsg = `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please configure these in Cloudflare Workers dashboard under Settings → Variables and Secrets. ` +
      `For local development, add them to .env.local file.`;
    throw new Error(errorMsg);
  }
  
  // At this point, TypeScript knows accountId and apiToken are defined (non-empty strings)
  // because we throw an error if they're missing
  const validatedAccountId = accountId!;
  let validatedApiToken = apiToken!;
  
  // Clean token: remove all whitespace, newlines, tabs, etc.
  validatedApiToken = validatedApiToken.trim().replace(/[\s\r\n\t]/g, '');
  
  // Validate token format (should not contain spaces, newlines, etc. after cleaning)
  if (validatedApiToken.length === 0) {
    throw new Error('CLOUDFLARE_IMAGES_API_TOKEN is empty after cleaning. Please check the token value.');
  }
  
  // Validate account ID format (should be alphanumeric)
  if (!/^[a-zA-Z0-9]+$/.test(validatedAccountId)) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID has invalid format. Please verify the account ID.');
  }
  
  return {
    accountId: validatedAccountId,
    apiToken: validatedApiToken,
    apiBase: `https://api.cloudflare.com/client/v4/accounts/${validatedAccountId}/images/v1`,
  };
}

// Helper to verify token format and provide diagnostics
function validateTokenFormat(token: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check length (Cloudflare API tokens are typically 40+ characters)
  if (token.length < 30) {
    issues.push(`Token appears too short (${token.length} chars). Cloudflare tokens are typically 40+ characters.`);
  }
  
  // Check for common invalid characters
  if (token.includes(' ') && !token.trim().includes(' ')) {
    issues.push('Token may have leading/trailing whitespace (will be trimmed).');
  }
  
  // Check for newlines (shouldn't be in token)
  if (token.includes('\n') || token.includes('\r')) {
    issues.push('Token contains newline characters which are invalid.');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// Verify token by making a test API call (non-blocking - if it fails, we still try upload)
async function verifyCloudflareToken(config: { accountId: string; apiToken: string; apiBase: string }): Promise<{ valid: boolean; error?: string; warning?: string }> {
  try {
    // Try to verify token by checking if it can access the Images API
    // We'll do a lightweight GET request to list images (with per_page=1 to minimize data)
    const imagesTestResponse = await fetch(`${config.apiBase}?per_page=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const testData = await imagesTestResponse.json().catch(() => null);
    
    // If we get 403, the token definitely doesn't have Images permissions
    if (imagesTestResponse.status === 403) {
      return {
        valid: false,
        error: 'API token does not have Cloudflare Images permissions. ' +
          'Please create a new token with: Account → Cloudflare Images → Edit permission. ' +
          'Make sure the token includes your account ID in Account Resources.',
      };
    }
    
    // If we get 401, the token is invalid
    if (imagesTestResponse.status === 401) {
      return {
        valid: false,
        error: 'API token is invalid or expired. Please create a new token in Cloudflare Dashboard.',
      };
    }
    
    // If we get 200 or other success status, token has permissions
    if (imagesTestResponse.ok) {
      return { valid: true };
    }
    
    // Other errors might be okay (like 404 if no images exist)
    return { valid: true, warning: `Token verification returned status ${imagesTestResponse.status}` };
  } catch (error) {
    // If verification fails due to network issues, we'll still try the upload
    console.warn('Token verification failed (non-blocking):', error);
    return { valid: true, warning: 'Could not verify token, but proceeding with upload attempt' };
  }
}

export async function uploadImageToCloudflare(
  file: File,
  env?: Record<string, any>
): Promise<{ id: string; url: string; variants: string[] }> {
  const config = getCloudflareConfig(env);

  // Validate token format before attempting upload
  const tokenValidation = validateTokenFormat(config.apiToken);
  if (!tokenValidation.valid) {
    console.warn('Token format validation warnings:', tokenValidation.issues);
  }

  // Verify token before attempting upload (non-blocking - gives better error messages)
  const tokenVerification = await verifyCloudflareToken(config);
  if (!tokenVerification.valid && tokenVerification.error) {
    // Throw error with clear instructions
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
    console.warn('Token verification warning:', tokenVerification.warning);
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
    // Token is already cleaned in getCloudflareConfig, but ensure it's still clean
    const cleanToken = config.apiToken.trim();
    
    // Construct Authorization header carefully - no extra spaces
    const authHeader = `Bearer ${cleanToken}`;
    
    // Prepare headers - don't set Content-Type for FormData (browser/runtime sets it with boundary)
    const headers: HeadersInit = {
      'Authorization': authHeader,
      'Accept': 'application/json',
    };
    
    // Log request details for debugging (without exposing full token)
    console.log('Cloudflare Images upload request:', {
      url: config.apiBase,
      method: 'POST',
      hasFile: !!file,
      fileSize: file.size,
      fileName: file.name,
      fileType: file.type,
      tokenLength: cleanToken.length,
      accountId: config.accountId,
    });
    
    response = await fetch(config.apiBase, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    responseData = await response.json().catch(() => null);
  } catch (fetchError) {
    const errorMsg = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
    console.error('Cloudflare Images API fetch error:', {
      error: errorMsg,
      apiBase: config.apiBase,
      hasToken: !!config.apiToken,
      fileSize: file.size,
      fileName: file.name,
    });
    throw new Error(`Failed to connect to Cloudflare Images API: ${errorMsg}`);
  }

  if (!response.ok) {
    const errorMessage = responseData?.errors?.[0]?.message || response.statusText;
    const errorCode = responseData?.errors?.[0]?.code || response.status;
    
    // Special handling for authentication errors
    if (response.status === 403 || errorCode === 10000) {
      // Get full error details from response
      const fullErrorDetails = responseData?.errors || [];
      
      console.error('Cloudflare Images API authentication error:', {
        status: response.status,
        errorCode,
        errorMessage,
        accountId: config.accountId,
        tokenLength: config.apiToken.length,
        tokenPrefix: config.apiToken.substring(0, 10) + '...',
        tokenSuffix: '...' + config.apiToken.substring(config.apiToken.length - 4),
        apiBase: config.apiBase,
        fullErrors: fullErrorDetails,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      });
      
      // Check if there's a more specific error message
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
    
    console.error('Cloudflare Images API error:', {
      status: response.status,
      statusText: response.statusText,
      errorCode,
      errorMessage,
      responseData,
    });
    
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
