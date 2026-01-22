import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ReferralNetworkNode } from '@/types';

async function buildNetworkTree(
  supabase: any,
  userId: string,
  level: number = 0,
  maxDepth: number = 5
): Promise<ReferralNetworkNode | null> {
  if (level > maxDepth) return null;

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, promo_code, total_referrals, accumulated_discount_percent, is_top6')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return null;
  }

  // Get direct referrals
  const { data: referrals, error: referralsError } = await supabase
    .from('referrals')
    .select('user_id')
    .eq('referrer_id', userId);

  if (referralsError) {
    console.error('Error fetching referrals:', referralsError);
  }

  // Recursively build children
  const children: ReferralNetworkNode[] = [];
  if (referrals && referrals.length > 0) {
    for (const ref of referrals) {
      const childNode = await buildNetworkTree(supabase, ref.user_id, level + 1, maxDepth);
      if (childNode) {
        children.push(childNode);
      }
    }
  }

  return {
    id: profile.id,
    user_id: profile.id,
    name: profile.full_name || 'Хэрэглэгч',
    promo_code: profile.promo_code,
    referral_count: profile.total_referrals || 0,
    discount_percent: profile.accumulated_discount_percent || 0,
    is_top6: profile.is_top6 || false,
    children,
    level,
  };
}

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
    const top6Only = searchParams.get('top6Only') === 'true';
    const userId = searchParams.get('userId');

    if (userId) {
      // Get network for specific user
      const network = await buildNetworkTree(supabase, userId);
      
      return NextResponse.json({
        network,
      });
    }

    if (top6Only) {
      // Get networks for all Top 6 members
      const { data: top6Members, error: top6Error } = await supabase
        .from('profiles')
        .select('id, full_name, promo_code, total_referrals')
        .eq('is_top6', true)
        .order('total_referrals', { ascending: false });

      if (top6Error) {
        console.error('Error fetching Top 6:', top6Error);
        return NextResponse.json(
          { error: 'Top 6 мэдээлэл татахад алдаа гарлаа' },
          { status: 500 }
        );
      }

      const networks = await Promise.all(
        (top6Members || []).map(async (member) => ({
          top6Member: member,
          network: await buildNetworkTree(supabase, member.id, 0, 3),
        }))
      );

      return NextResponse.json({
        top6_networks: networks,
      });
    }

    // Get all root users (users without referrers)
    const { data: rootUsers, error: rootError } = await supabase
      .from('profiles')
      .select('id')
      .limit(100); // Limit to prevent timeout

    if (rootError) {
      console.error('Error fetching root users:', rootError);
      return NextResponse.json(
        { error: 'Мэдээлэл татахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    // Filter to only users who have no referrer
    const rootUserIds = await Promise.all(
      (rootUsers || []).map(async (u) => {
        const { data: hasReferrer } = await supabase
          .from('referrals')
          .select('id')
          .eq('user_id', u.id)
          .single();
        
        return hasReferrer ? null : u.id;
      })
    );

    const filteredRootIds = rootUserIds.filter(id => id !== null) as string[];

    return NextResponse.json({
      root_user_ids: filteredRootIds.slice(0, 20), // Return first 20
      message: 'Use ?userId=<id> to get specific network tree',
    });

  } catch (error) {
    console.error('Error in /api/admin/referral-network:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
