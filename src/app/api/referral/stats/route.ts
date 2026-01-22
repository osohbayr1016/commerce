import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Нэвтэрч орно уу' },
        { status: 401 }
      );
    }

    // Get referral stats using database function
    const { data: stats, error: statsError } = await supabase
      .rpc('get_referral_stats', { p_user_id: user.id });

    if (statsError) {
      console.error('Error fetching stats:', statsError);
      return NextResponse.json(
        { error: 'Статистик татахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    // Get list of referred users (anonymized)
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        id,
        user_id,
        created_at,
        profiles!referrals_user_id_fkey(full_name)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
    }

    const referredUsers = referrals?.map((ref: any, index: number) => ({
      id: ref.id,
      display_name: `Хэрэглэгч #${index + 1}`,
      created_at: ref.created_at,
    })) || [];

    // Get recent discount events
    const { data: recentEvents, error: eventsError } = await supabase
      .from('discount_events')
      .select(`
        id,
        discount_percent,
        purchase_amount_mnt,
        created_at,
        profiles!discount_events_earned_from_user_id_fkey(full_name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
    }

    const discountEvents = recentEvents?.map((event: any, index: number) => ({
      id: event.id,
      discount_percent: event.discount_percent,
      purchase_amount_mnt: event.purchase_amount_mnt,
      created_at: event.created_at,
      earned_from: `Хэрэглэгч #${index + 1}`,
    })) || [];

    return NextResponse.json({
      stats,
      referred_users: referredUsers,
      recent_discount_events: discountEvents,
    });

  } catch (error) {
    console.error('Error in referral stats:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
