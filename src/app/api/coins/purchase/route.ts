import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-errors';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

const COIN_PRICE_MNT = 1000; // 1 coin = 1000 MNT

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return apiError('Нэвтэрч орно уу', 401);
    }

    const body = await request.json();
    const { coinAmount } = body;

    // Validate coin amount
    if (!coinAmount || coinAmount < 1 || !Number.isInteger(coinAmount)) {
      return apiError('Зөв тооны монет сонгоно уу', 400);
    }

    const totalPrice = coinAmount * COIN_PRICE_MNT;

    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment
    
    // Update coin balance using the function
    const { error: updateError } = await supabase.rpc('update_coin_balance', {
      p_user_id: user.id,
      p_amount: coinAmount,
      p_transaction_type: 'purchase',
      p_description: `Худалдан авсан: ${coinAmount} монет (₮${totalPrice.toLocaleString()})`,
    });

    if (updateError) {
      console.error('Error updating coin balance:', updateError);
      return apiError('Монет нэмэхэд алдаа гарлаа', 500);
    }

    // Fetch updated profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('coin_balance')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return apiError('Мэдээллийг татахад алдаа гарлаа', 500);
    }

    return NextResponse.json({
      success: true,
      message: `${coinAmount} монет амжилттай нэмэгдлээ!`,
      newBalance: profile.coin_balance,
      purchasedCoins: coinAmount,
      paidAmount: totalPrice,
    });

  } catch (error) {
    console.error('Error in coin purchase:', error);
    return apiError('Алдаа гарлаа. Дахин оролдоно уу.', 500);
  }
}
