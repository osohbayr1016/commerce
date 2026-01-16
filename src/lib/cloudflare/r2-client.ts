import { S3Client } from '@aws-sdk/client-s3';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
}

export function getR2Config(): R2Config {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim() || 'commerce';

  const missing = [];
  if (!accountId) missing.push('CLOUDFLARE_ACCOUNT_ID');
  if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
  if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing required R2 environment variables: ${missing.join(', ')}. ` +
        `Please configure these in Cloudflare Workers dashboard under Settings → Variables and Secrets.`
    );
  }

  const validatedAccountId = accountId!;
  const validatedAccessKeyId = accessKeyId!;
  const validatedSecretAccessKey = secretAccessKey!;

  return {
    accountId: validatedAccountId,
    accessKeyId: validatedAccessKeyId,
    secretAccessKey: validatedSecretAccessKey,
    bucketName,
    endpoint: `https://${validatedAccountId}.r2.cloudflarestorage.com`,
  };
}

export function createR2Client(): S3Client {
  const config = getR2Config();

  return new S3Client({
    region: 'auto',
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export function getR2PublicUrl(key: string): string {
  // Check if R2_PUBLIC_URL is configured
  const r2PublicUrl = process.env.R2_PUBLIC_URL;
  
  console.log('[R2] getR2PublicUrl called with key:', key);
  console.log('[R2] R2_PUBLIC_URL from env:', r2PublicUrl);
  console.log('[R2] NODE_ENV:', process.env.NODE_ENV);
  
  if (r2PublicUrl) {
    const baseUrl = r2PublicUrl.replace(/\/$/, '');
    const finalUrl = `${baseUrl}/${key}`;
    console.log('[R2] Using R2_PUBLIC_URL, final URL:', finalUrl);
    return finalUrl;
  }

  // Check if we're in local development
  const isLocalDev = process.env.NODE_ENV === 'development' || 
                     (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  
  console.log('[R2] isLocalDev:', isLocalDev);
  
  if (isLocalDev) {
    // Use proxy for local development
    const proxyUrl = `/api/images/r2/${key}`;
    console.log('[R2] Using proxy URL:', proxyUrl);
    return proxyUrl;
  }

  // Production: use R2 public domain
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim() || 'commerce';
  
  console.log('[R2] accountId:', accountId, 'bucketName:', bucketName);
  
  if (accountId) {
    // Return R2.dev public URL
    const constructedUrl = `https://pub-${accountId}.r2.dev/${bucketName}/${key}`;
    console.log('[R2] Using constructed URL:', constructedUrl);
    return constructedUrl;
  }

  // Last resort fallback
  console.error('[R2] No R2 public URL configured, images may not display');
  return `/api/images/r2/${key}`;
}
