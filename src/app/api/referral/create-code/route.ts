import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PROMO_CODE_REGEX = /^[A-Z0-9]{3,20}$/;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Нэвтэрч орно уу' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { promoCode } = body;

    if (!promoCode || typeof promoCode !== 'string') {
      return NextResponse.json(
        { error: 'Promo код оруулна уу' },
        { status: 400 }
      );
    }

    // Validate format: 3-20 characters, alphanumeric, uppercase
    const normalizedCode = promoCode.toUpperCase().trim();
    
    if (!PROMO_CODE_REGEX.test(normalizedCode)) {
      return NextResponse.json(
        { error: 'Promo код 3-20 тэмдэгт, зөвхөн үсэг болон тоо агуулах ёстой' },
        { status: 400 }
      );
    }

    // Check if code is available using database function
    const { data: isAvailable, error: checkError } = await supabase
      .rpc('is_promo_code_available', { p_promo_code: normalizedCode });

    if (checkError) {
      console.error('Error checking promo code:', checkError);
      return NextResponse.json(
        { error: 'Promo код шалгахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Энэ promo код аль хэдийн ашиглагдаж байна' },
        { status: 409 }
      );
    }

    // Update user's promo code
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ promo_code: normalizedCode })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating promo code:', updateError);
      return NextResponse.json(
        { error: 'Promo код шинэчлэхэд алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      promoCode: normalizedCode,
      message: 'Promo код амжилттай үүсгэгдлээ!',
    });

  } catch (error) {
    console.error('Error in promo code creation:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}

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

    // Get user's current promo code
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('promo_code, total_referrals')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Мэдээлэл татахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      promoCode: profile.promo_code,
      totalReferrals: profile.total_referrals || 0,
    });

  } catch (error) {
    console.error('Error fetching promo code:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
