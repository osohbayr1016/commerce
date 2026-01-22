import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const COIN_PRICE_MNT = 1000; // 1 coin = 1000 MNT

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Нэвтэрч орно уу' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { coinAmount } = body;

    // Validate coin amount
    if (!coinAmount || coinAmount < 1 || !Number.isInteger(coinAmount)) {
      return NextResponse.json(
        { error: 'Зөв тооны монет сонгоно уу' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Монет нэмэхэд алдаа гарлаа' },
        { status: 500 }
      );
    }

    // Fetch updated profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('coin_balance')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Мэдээллийг татахад алдаа гарлаа' },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
