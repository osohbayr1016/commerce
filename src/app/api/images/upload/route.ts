import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadFileToR2 } from '@/lib/cloudflare/r2-upload';

const MAX_FILE_SIZE = 10 * 1024 * 1024; 
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const isDevelopment = process.env.NODE_ENV === 'development';

export async function POST(request: NextRequest) {
  try {
    
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json(
        {
          error: 'Authentication failed',
          ...(isDevelopment && { details: authError.message }),
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to upload images.' },
        { status: 401 }
      );
    }

    
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'Failed to parse form data',
          ...(isDevelopment && {
            details: parseError instanceof Error ? parseError.message : 'Unknown error',
          }),
        },
        { status: 400 }
      );
    }

    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided. Please select at least one image file.' },
        { status: 400 }
      );
    }

    
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      if (!file || !(file instanceof File)) {
        validationErrors.push('Invalid file object received');
        continue;
      }

      if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
        validationErrors.push(
          `Invalid file type for "${file.name}": ${file.type || 'unknown'}. Allowed types: JPG, PNG, WEBP`
        );
        continue;
      }

      if (file.size === 0) {
        validationErrors.push(`File "${file.name}" is empty`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(
          `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size: 10MB`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'File validation failed',
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: 'No valid files to upload' },
        { status: 400 }
      );
    }

    
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
    const r2AccessKey = process.env.R2_ACCESS_KEY_ID?.trim();
    const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
    
    if (!accountId || !r2AccessKey || !r2SecretKey) {
      const missing = [];
      if (!accountId) missing.push('CLOUDFLARE_ACCOUNT_ID');
      if (!r2AccessKey) missing.push('R2_ACCESS_KEY_ID');
      if (!r2SecretKey) missing.push('R2_SECRET_ACCESS_KEY');
      
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: `Missing required R2 environment variables: ${missing.join(', ')}. ` +
            `Please configure these in Cloudflare Workers dashboard under Settings → Variables and Secrets.`,
        },
        { status: 500 }
      );
    }

    
    const uploadedImages = [];
    const uploadErrors: string[] = [];

    
    
    const r2Bucket = null; 

    for (const file of validFiles) {
      try {
        const result = await uploadFileToR2(file, 'products', r2Bucket);
        uploadedImages.push({
          id: result.key,
          url: result.url,
          variants: [result.url], 
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown upload error';
        uploadErrors.push(`Failed to upload "${file.name}": ${errorMessage}`);
      }
    }

    
    if (uploadErrors.length > 0 && uploadedImages.length === 0) {
      return NextResponse.json(
        {
          error: 'All file uploads failed',
          details: uploadErrors, 
        },
        { status: 500 }
      );
    }

    
    if (uploadErrors.length > 0) {
      return NextResponse.json(
        {
          success: true,
          images: uploadedImages,
          warnings: uploadErrors,
          message: `${uploadedImages.length} file(s) uploaded successfully, ${uploadErrors.length} failed`,
        },
        { status: 200 }
      );
    }

    
    return NextResponse.json(
      {
        success: true,
        images: uploadedImages,
        message: `${uploadedImages.length} file(s) uploaded successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
        ...(isDevelopment && { stack: errorStack }),
      },
      { status: 500 }
    );
  }
}
