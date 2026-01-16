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
  const r2PublicUrl = process.env.R2_PUBLIC_URL;

  if (r2PublicUrl) {
    const baseUrl = r2PublicUrl.replace(/\/$/, '');
    const finalUrl = `${baseUrl}/${key}`;
    return finalUrl;
  }

  const isLocalDev = process.env.NODE_ENV === 'development' || 
                     (typeof window !== 'undefined' && window.location.hostname === 'localhost');

  if (isLocalDev) {
    const proxyUrl = `/api/images/r2/${key}`;
    return proxyUrl;
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim() || 'commerce';

  if (accountId) {
    const constructedUrl = `https://pub-${accountId}.r2.dev/${bucketName}/${key}`;
    return constructedUrl;
  }

  return `/api/images/r2/${key}`;
}
