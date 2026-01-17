import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  
  const color = searchParams.get('color');
  const material = searchParams.get('material');
  const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : null;
  
  const supabase = await createClient();

  try {
    // Get product stock if no variants
    const { data: product } = await supabase
      .from('products')
      .select('stock, colors, materials, sizes')
      .eq('id', id)
      .single();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', stock: 0, available: false },
        { status: 404 }
      );
    }

    // Check if product has variants
    const { data: variants } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('product_id', id)
      .eq('is_active', true);

    // If no variants exist, return product stock
    if (!variants || variants.length === 0) {
      return NextResponse.json({
        stock: product.stock ?? 0,
        available: (product.stock ?? 0) > 0,
        hasVariants: false,
      });
    }

    // Get specific variant stock
    let query = supabase
      .from('product_variants')
      .select('stock, price_adjustment')
      .eq('product_id', id)
      .eq('is_active', true);

    if (color) query = query.eq('color', color);
    if (material) query = query.eq('material', material);
    if (size) query = query.eq('size', size);

    const { data: variant } = await query.single();

    if (!variant) {
      return NextResponse.json({
        stock: 0,
        available: false,
        hasVariants: true,
        message: 'Variant not found'
      });
    }

    return NextResponse.json({
      stock: variant.stock ?? 0,
      available: (variant.stock ?? 0) > 0,
      priceAdjustment: variant.price_adjustment ?? 0,
      hasVariants: true,
    });

  } catch (error) {
    console.error('Variant stock error:', error);
    return NextResponse.json(
      { error: 'Failed to get variant stock', stock: 0, available: false },
      { status: 500 }
    );
  }
}
