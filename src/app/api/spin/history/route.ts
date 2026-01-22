import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// =====================================================
// GET /api/spin/history
// =====================================================
// Get user's spin history
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch spin history with product details
    const { data: history, error } = await supabase
      .from('spin_history')
      .select(`
        *,
        product:products (
          id,
          name_mn,
          name_en,
          price,
          image_url,
          brand
        )
      `)
      .eq('user_id', user.id)
      .order('won_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching spin history:', error);
      return NextResponse.json(
        { error: 'Spin түүх татах үед алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json(history || [], { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/spin/history:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    );
  }
}
