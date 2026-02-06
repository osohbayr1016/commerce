import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Нэвтэрч орно уу' }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Зөвхөн админ хандах эрхтэй' }, { status: 403 }) };
  }
  try {
    return { adminClient: createAdminClient() };
  } catch (e) {
    console.error('Admin client init failed:', e);
    return { error: NextResponse.json({ error: 'Тохиргооны алдаа' }, { status: 503 }) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const body = await req.json().catch(() => ({}));
    const { sizeStocks, ...productFields } = body;
    const { data: product, error } = await auth.adminClient!
      .from('products')
      .insert(productFields)
      .select('id')
      .single();
    if (error) {
      console.error('Product create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const productType = body.product_type as string | undefined;
    if (
      product?.id &&
      (productType === 'shoes' || productType === 'clothes') &&
      sizeStocks &&
      typeof sizeStocks === 'object'
    ) {
      const rows = Object.entries(sizeStocks).map(([size, stock]) => ({
        product_id: product.id,
        color: null,
        material: null,
        size: parseInt(size, 10),
        stock: Math.max(0, Number(stock) || 0),
      }));
      if (rows.length) {
        const { error: insErr } = await auth.adminClient!
          .from('product_variants')
          .insert(rows);
        if (insErr) {
          console.error('Product variants insert error:', insErr);
          return NextResponse.json({ error: insErr.message }, { status: 500 });
        }
      }
    }
    return NextResponse.json({ success: true, id: product?.id });
  } catch (e) {
    console.error('POST /api/admin/products:', e);
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
