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

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
const CLOUDFLARE_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

export async function uploadImageToCloudflare(
  file: File
): Promise<{ id: string; url: string; variants: string[] }> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN) {
    throw new Error('Cloudflare Images credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${CLOUDFLARE_API_BASE}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.errors?.[0]?.message || `Upload failed: ${response.statusText}`
    );
  }

  const data: CloudflareImageUploadResponse = await response.json();

  if (!data.success || !data.result) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to upload image to Cloudflare'
    );
  }

  const imageId = data.result.id;
  const variants = data.result.variants;
  const url = variants[0] || getImageUrl(imageId);

  return {
    id: imageId,
    url,
    variants,
  };
}

export function getImageUrl(
  imageId: string,
  variant: string = 'public'
): string {
  if (!CLOUDFLARE_ACCOUNT_ID) {
    throw new Error('Cloudflare Account ID not configured');
  }

  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${imageId}/${variant}`;
}

export async function deleteImageFromCloudflare(
  imageId: string
): Promise<void> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN) {
    throw new Error('Cloudflare Images credentials not configured');
  }

  const response = await fetch(`${CLOUDFLARE_API_BASE}/${imageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.errors?.[0]?.message || `Delete failed: ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to delete image from Cloudflare'
    );
  }
}

export async function getImageInfo(
  imageId: string
): Promise<CloudflareImageResponse['result']> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN) {
    throw new Error('Cloudflare Images credentials not configured');
  }

  const response = await fetch(`${CLOUDFLARE_API_BASE}/${imageId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.errors?.[0]?.message || `Get image failed: ${response.statusText}`
    );
  }

  const data: CloudflareImageResponse = await response.json();

  if (!data.success || !data.result) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to get image info from Cloudflare'
    );
  }

  return data.result;
}
