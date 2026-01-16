import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, images')
      .not('images', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products to fix',
        updated: 0,
      });
    }

    let updatedCount = 0;
    const errors: string[] = [];

    
    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        continue;
      }

      
      const needsFix = product.images.some((url: string) => 
        url.includes('/commerce/products/')
      );

      if (!needsFix) {
        continue;
      }

      
      const fixedImages = product.images.map((url: string) => {
        if (typeof url === 'string' && url.includes('/commerce/products/')) {
          return url.replace('/commerce/products/', '/products/');
        }
        return url;
      });

      
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: fixedImages })
        .eq('id', product.id);

      if (updateError) {
        errors.push(`Product ${product.id}: ${updateError.message}`);
      } else {
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${updatedCount} products`,
      updated: updatedCount,
      total: products.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fix image URLs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
