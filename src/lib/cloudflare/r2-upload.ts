import { getR2PublicUrl } from './r2-client';
import { AwsClient } from 'aws4fetch';


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

  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `${timestamp}-${randomString}.${fileExtension}`;
  const key = `${folder}/${fileName}`;

  
  const arrayBuffer = await file.arrayBuffer();

  try {
    
    if (r2Bucket && typeof r2Bucket.put === 'function') {
      
      await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        },
      });
      
    } else {
      
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
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
        body: arrayBuffer,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`R2 upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const publicUrl = getR2PublicUrl(key);

    return {
      url: publicUrl,
      key: key,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown R2 upload error';
    throw new Error(`Failed to upload to R2: ${errorMsg}`);
  }
}


export async function deleteFileFromR2(key: string, r2Bucket?: any): Promise<void> {
  try {
    
    if (r2Bucket && typeof r2Bucket.delete === 'function') {
      
      await r2Bucket.delete(key);
    } else {
      
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
    throw new Error(`Failed to delete from R2: ${errorMsg}`);
  }
}
