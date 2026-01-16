import { getR2PublicUrl } from './r2-client';

// Upload file to R2 using Cloudflare Workers R2 binding
export async function uploadFileToR2(
  file: File,
  folder: string = 'products',
  r2Bucket?: any
): Promise<{ url: string; key: string }> {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided. Expected File object.');
  }

  if (file.size === 0) {
    throw new Error('File is empty');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `${timestamp}-${randomString}.${fileExtension}`;
  const key = `${folder}/${fileName}`;

  // Convert File to ArrayBuffer for R2
  const arrayBuffer = await file.arrayBuffer();

  try {
    // Check if we have R2 binding (Cloudflare Workers environment)
    if (r2Bucket && typeof r2Bucket.put === 'function') {
      console.log('Using R2 binding for upload');
      // Use R2 binding (Cloudflare Workers)
      await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        },
      });
    } else {
      console.log('Using AWS SDK for upload (local development)');
      // Fallback to AWS SDK for local development
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      const { createR2Client, getR2Config } = await import('./r2-client');
      
      const config = getR2Config();
      const client = createR2Client();
      
      const body = typeof Buffer !== 'undefined' 
        ? Buffer.from(arrayBuffer) 
        : new Uint8Array(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        Body: body,
        ContentType: file.type || 'image/jpeg',
        CacheControl: 'public, max-age=31536000',
      });

      await client.send(command);
    }

    // Generate public URL
    const publicUrl = getR2PublicUrl(key);

    return {
      url: publicUrl,
      key: key,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown R2 upload error';
    console.error('R2 upload error:', {
      error: errorMsg,
      key: key,
      fileSize: file.size,
      fileName: file.name,
      hasR2Binding: !!(r2Bucket && typeof r2Bucket.put === 'function'),
    });
    throw new Error(`Failed to upload to R2: ${errorMsg}`);
  }
}

// Delete file from R2
export async function deleteFileFromR2(key: string, r2Bucket?: any): Promise<void> {
  try {
    // Check if we have R2 binding (Cloudflare Workers environment)
    if (r2Bucket && typeof r2Bucket.delete === 'function') {
      // Use R2 binding (Cloudflare Workers)
      await r2Bucket.delete(key);
    } else {
      // Fallback to AWS SDK for local development
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const { createR2Client, getR2Config } = await import('./r2-client');
      
      const config = getR2Config();
      const client = createR2Client();

      const command = new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      });

      await client.send(command);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown R2 delete error';
    console.error('R2 delete error:', errorMsg);
    throw new Error(`Failed to delete from R2: ${errorMsg}`);
  }
}
