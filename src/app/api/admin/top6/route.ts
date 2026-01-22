import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: List current Top 6 members
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

    // Get Top 6 members with their stats
    const { data: top6Members, error: top6Error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        promo_code,
        total_referrals,
        accumulated_discount_percent,
        is_top6,
        created_at
      `)
      .eq('is_top6', true)
      .order('total_referrals', { ascending: false });

    if (top6Error) {
      console.error('Error fetching Top 6:', top6Error);
      return NextResponse.json(
        { error: 'Top 6 мэдээлэл татахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    // Get additional stats for each member
    const membersWithStats = await Promise.all(
      (top6Members || []).map(async (member) => {
        // Get total discount events
        const { count: discountEventsCount } = await supabase
          .from('discount_events')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', member.id);

        // Get network size (all descendants)
        const { count: networkSize } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', member.id);

        return {
          ...member,
          stats: {
            total_referrals: member.total_referrals || 0,
            total_discount_earned: member.accumulated_discount_percent || 0,
            network_size: networkSize || 0,
            discount_events_count: discountEventsCount || 0,
          },
        };
      })
    );

    return NextResponse.json({
      top6: membersWithStats,
      total: membersWithStats.length,
    });

  } catch (error) {
    console.error('Error in GET /api/admin/top6:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}

// POST: Add user to Top 6
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID оруулна уу' },
        { status: 400 }
      );
    }

    // Check current Top 6 count
    const { count: currentTop6Count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_top6', true);

    if ((currentTop6Count || 0) >= 6) {
      return NextResponse.json(
        { error: 'Top 6 дүүрсэн байна. Нэг хүнийг хасах хэрэгтэй' },
        { status: 400 }
      );
    }

    // Add to Top 6
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_top6: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Error adding to Top 6:', updateError);
      return NextResponse.json(
        { error: 'Top 6-д нэмэхэд алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Амжилттай Top 6-д нэмэгдлээ',
    });

  } catch (error) {
    console.error('Error in POST /api/admin/top6:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove user from Top 6
export async function DELETE(request: NextRequest) {
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID оруулна уу' },
        { status: 400 }
      );
    }

    // Remove from Top 6
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_top6: false })
      .eq('id', userId);

    if (updateError) {
      console.error('Error removing from Top 6:', updateError);
      return NextResponse.json(
        { error: 'Top 6-с хасахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Амжилттай Top 6-с хасагдлаа',
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/top6:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
