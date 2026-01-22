import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SpinResult } from '@/types';

// =====================================================
// POST /api/spin/play
// =====================================================
// Perform a spin and get result
export async function POST(req: NextRequest) {
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

    // Get client info for tracking (optional)
    const body = await req.json().catch(() => ({}));
    const { session_id } = body;

    // Get IP and User-Agent from headers
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const user_agent = req.headers.get('user-agent') || null;

    // Call database function to perform spin
    const { data: result, error } = await supabase.rpc('perform_spin', {
      p_user_id: user.id,
      p_session_id: session_id || null,
      p_ip_address: ip_address,
      p_user_agent: user_agent,
    });

    if (error) {
      console.error('Error performing spin:', error);
      return NextResponse.json(
        { error: 'Spin эргүүлэхэд алдаа гарлаа' },
        { status: 500 }
      );
    }

    // If not successful, return error
    if (!result.success) {
      const spinResult: SpinResult = {
        success: false,
        error: result.error,
        eligibility: result.eligibility || undefined,
      };
      return NextResponse.json(spinResult, { status: 400 });
    }

    // Success! Return the won product
    const spinResult: SpinResult = {
      success: true,
      spin_history_id: result.spin_history_id,
      won_product: result.won_product,
      new_coin_balance: result.new_coin_balance,
      added_to_cart: result.added_to_cart,
      cart_id: result.cart_id,
    };

    return NextResponse.json(spinResult, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/spin/play:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    );
  }
}
