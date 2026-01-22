import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SpinEligibility } from '@/types';

// =====================================================
// GET /api/spin/eligibility
// =====================================================
// Check if user can spin today
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

    // Call database function to check eligibility
    const { data: eligibility, error } = await supabase.rpc(
      'can_user_spin_today',
      { p_user_id: user.id }
    );

    if (error) {
      console.error('Error checking spin eligibility:', error);
      return NextResponse.json(
        { error: 'Эрх шалгахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    const result: SpinEligibility = {
      can_spin: eligibility.can_spin,
      reason: eligibility.reason,
      last_spin_at: eligibility.last_spin_at || null,
      next_spin_at: eligibility.next_spin_at || null,
      active_products_count: eligibility.active_products_count,
      cost_coins: eligibility.cost_coins || undefined,
      required_coins: eligibility.required_coins || undefined,
      current_balance: eligibility.current_balance || undefined,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/spin/eligibility:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    );
  }
}
