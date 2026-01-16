import { getR2PublicUrl } from './r2-client';
import { AwsClient } from 'aws4fetch';

// Upload file to R2 using R2 binding or aws4fetch
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
      console.log('[R2 Upload] Using R2 binding for upload');
      console.log('[R2 Upload] Key:', key);
      console.log('[R2 Upload] File size:', file.size);
      console.log('[R2 Upload] Content type:', file.type);
      
      await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        },
      });
      
      console.log('[R2 Upload] R2 binding upload successful');
    } else {
      console.log('[R2 Upload] Using aws4fetch for upload');
      // Use aws4fetch (works in Cloudflare Workers without Node.js APIs)
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
      const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
      const bucketName = process.env.R2_BUCKET_NAME || 'commerce';
      
      const url = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      
      console.log('[R2 Upload] Upload URL:', url);
      console.log('[R2 Upload] File size:', file.size);
      
      const aws = new AwsClient({
        accessKeyId,
        secretAccessKey,
      });
      
      const response = await aws.fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
        body: arrayBuffer,
      });
      
      console.log('[R2 Upload] Upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[R2 Upload] Upload failed:', errorText);
        throw new Error(`R2 upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      console.log('[R2 Upload] aws4fetch upload successful');
    }

    // Generate public URL
    console.log('[R2 Upload] Generating public URL for key:', key);
    const publicUrl = getR2PublicUrl(key);
    console.log('[R2 Upload] Generated public URL:', publicUrl);

    return {
      url: publicUrl,
      key: key,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown R2 upload error';
    console.error('[R2 Upload] R2 upload error:', {
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
      // Use aws4fetch for delete
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
      const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
      const bucketName = process.env.R2_BUCKET_NAME || 'commerce';
      
      const url = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      
      const aws = new AwsClient({
        accessKeyId,
        secretAccessKey,
      });
      
      const response = await aws.fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        throw new Error(`R2 delete failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown R2 delete error';
    console.error('R2 delete error:', errorMsg);
    throw new Error(`Failed to delete from R2: ${errorMsg}`);
  }
}
