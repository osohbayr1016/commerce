import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// =====================================================
// GET /api/admin/spin/statistics
// =====================================================
// Get spin wheel statistics
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Админ эрх шаардлагатай' },
        { status: 403 }
      );
    }

    // Get days parameter (default 30)
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Call database function
    const { data: statistics, error } = await supabase.rpc(
      'get_spin_statistics',
      { p_days: days }
    );

    if (error) {
      console.error('Error fetching spin statistics:', error);
      return NextResponse.json(
        { error: 'Статистик татах үед алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/admin/spin/statistics:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    );
  }
}
