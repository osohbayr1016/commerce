import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin permission
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Нэвтэрч орно уу' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Зөвхөн админ хандах эрхтэй' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Хайлтын үг 2-оос дээш тэмдэгт байх ёстой' },
        { status: 400 }
      );
    }

    const normalizedQuery = query.toUpperCase();

    // Search by promo code, email, or name
    const { data: users, error: searchError } = await supabase
      .from('profiles')
      .select('id, full_name, email, promo_code, total_referrals, is_top6')
      .or(`promo_code.ilike.%${normalizedQuery}%,email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .eq('is_top6', false)  // Only show users not already in Top 6
      .limit(20);

    if (searchError) {
      console.error('Error searching users:', searchError);
      return NextResponse.json(
        { error: 'Хайлтад алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: users || [],
      total: users?.length || 0,
    });

  } catch (error) {
    console.error('Error in user search:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
