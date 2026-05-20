import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function DELETE(request: Request) {
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    // Remove dependent rows from all referencing tables
    await supabase.from('product_variants').delete().in('product_id', productIds);
    await supabase.from('wishlist').delete().in('product_id', productIds);
    await supabase.from('product_views').delete().in('product_id', productIds);

    // spin_history → spin_products → products
    const { data: spinProducts } = await supabase
      .from('spin_products')
      .select('id')
      .in('product_id', productIds);
    if (spinProducts && spinProducts.length > 0) {
      const spinProductIds = spinProducts.map((sp: { id: string }) => sp.id);
      await supabase.from('spin_history').delete().in('spin_product_id', spinProductIds);
    }
    await supabase.from('spin_products').delete().in('product_id', productIds);

    // Optional tables (silently ignore if they don't exist)
    const optionalTables = ["cart_items", "reviews"];
    for (const table of optionalTables) {
      const { error: optErr } = await supabase.from(table).delete().in('product_id', productIds);
      if (optErr) {
        console.log(`Skipping ${table}: ${optErr.message}`);
      }
    }

    // order_items – must delete these since product_id is NOT NULL
    const { error: orderItemsErr } = await supabase
      .from('order_items')
      .delete()
      .in('product_id', productIds);
    if (orderItemsErr) {
      console.error('order_items delete error:', orderItemsErr);
      return NextResponse.json(
        { error: `order_items: ${orderItemsErr.message}` },
        { status: 500 }
      );
    }

    // Now delete the products
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', productIds);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `${productIds.length} products deleted successfully`,
      count: productIds.length
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productIds, action, value } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'updatePrice':
        if (typeof value !== 'number' || value < 0) {
          return NextResponse.json(
            { error: 'Valid price is required' },
            { status: 400 }
          );
        }
        updateData = { price: value };
        break;

      case 'updateStock':
        if (typeof value !== 'number' || value < 0) {
          return NextResponse.json(
            { error: 'Valid stock is required' },
            { status: 400 }
          );
        }
        updateData = { stock: value };
        break;

      case 'updateDiscount':
        if (typeof value !== 'number' || value < 0 || value > 100) {
          return NextResponse.json(
            { error: 'Valid discount (0-100) is required' },
            { status: 400 }
          );
        }
        updateData = { discount: value };
        break;

      case 'adjustPrice':
        if (typeof value !== 'number') {
          return NextResponse.json(
            { error: 'Valid adjustment value is required' },
            { status: 400 }
          );
        }
        const { data: products } = await supabase
          .from('products')
          .select('id, price')
          .in('id', productIds);

        if (!products) {
          throw new Error('Failed to fetch products');
        }

        const updates = products.map((p: { id: string; price: number }) => ({
          id: p.id,
          price: Math.max(0, (p.price || 0) + value)
        }));

        for (const update of updates) {
          await supabase
            .from('products')
            .update({ price: update.price })
            .eq('id', update.id);
        }

        return NextResponse.json({
          success: true,
          message: `${productIds.length} products updated successfully`,
          count: productIds.length
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .in('id', productIds);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `${productIds.length} products updated successfully`,
      count: productIds.length
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}
