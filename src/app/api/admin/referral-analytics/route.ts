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

    // 1. Most used promo codes
    const { data: topPromoCodes, error: promoError } = await supabase
      .from('referrals')
      .select('promo_code_used')
      .order('created_at', { ascending: false });

    const promoCodeCounts: Record<string, number> = {};
    topPromoCodes?.forEach((ref: any) => {
      const code = ref.promo_code_used;
      promoCodeCounts[code] = (promoCodeCounts[code] || 0) + 1;
    });

    const topPromoCodesArray = Object.entries(promoCodeCounts)
      .map(([code, count]) => ({ promo_code: code, usage_count: count }))
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 10);

    // 2. Top referrers by referral count
    const { data: topReferrers, error: referrersError } = await supabase
      .from('profiles')
      .select('id, full_name, promo_code, total_referrals, accumulated_discount_percent')
      .gt('total_referrals', 0)
      .order('total_referrals', { ascending: false })
      .limit(10);

    // 3. Total discount awarded
    const { data: allEvents, error: eventsError } = await supabase
      .from('discount_events')
      .select('discount_percent');

    const totalDiscountAwarded = allEvents?.reduce(
      (sum: number, event: any) => sum + event.discount_percent,
      0
    ) || 0;

    // 4. Average referrals per user
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('total_referrals');

    const totalUsers = allProfiles?.length || 1;
    const totalReferrals = allProfiles?.reduce(
      (sum: number, p: any) => sum + (p.total_referrals || 0),
      0
    ) || 0;
    const avgReferralsPerUser = totalReferrals / totalUsers;

    // 5. Referral trends (last 30 days)
    const { data: recentReferrals, error: trendsError } = await supabase
      .from('referrals')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    // Group by day
    const referralsByDay: Record<string, number> = {};
    recentReferrals?.forEach((ref: any) => {
      const day = ref.created_at.split('T')[0];
      referralsByDay[day] = (referralsByDay[day] || 0) + 1;
    });

    // 6. Discount distribution
    const { data: discountDistribution, error: distError } = await supabase
      .from('profiles')
      .select('accumulated_discount_percent');

    const discountRanges = {
      '0%': 0,
      '1-5%': 0,
      '6-10%': 0,
      '11-20%': 0,
      '21-50%': 0,
      '50%+': 0,
    };

    discountDistribution?.forEach((p: any) => {
      const percent = p.accumulated_discount_percent || 0;
      if (percent === 0) discountRanges['0%']++;
      else if (percent <= 5) discountRanges['1-5%']++;
      else if (percent <= 10) discountRanges['6-10%']++;
      else if (percent <= 20) discountRanges['11-20%']++;
      else if (percent <= 50) discountRanges['21-50%']++;
      else discountRanges['50%+']++;
    });

    // 7. Total users with referrals
    const { count: usersWithReferrals } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_referrals', 0);

    return NextResponse.json({
      top_promo_codes: topPromoCodesArray,
      top_referrers: topReferrers || [],
      summary: {
        total_discount_awarded: totalDiscountAwarded,
        avg_referrals_per_user: Math.round(avgReferralsPerUser * 100) / 100,
        total_users: totalUsers,
        users_with_referrals: usersWithReferrals || 0,
        total_referrals: totalReferrals,
      },
      referral_trends: {
        last_30_days: referralsByDay,
      },
      discount_distribution: discountRanges,
    });

  } catch (error) {
    console.error('Error in /api/admin/referral-analytics:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
