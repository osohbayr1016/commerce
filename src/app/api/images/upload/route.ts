import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadImageToCloudflare } from '@/lib/cloudflare/images';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file) continue;

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type: ${file.name}. Allowed types: jpg, png, webp`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File too large: ${file.name}. Maximum size: 10MB`,
          },
          { status: 400 }
        );
      }

      try {
        const result = await uploadImageToCloudflare(file);
        uploadedImages.push({
          id: result.id,
          url: result.url,
          variants: result.variants,
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          {
            error:
              error instanceof Error
                ? error.message
                : 'Failed to upload image to Cloudflare',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        images: uploadedImages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
