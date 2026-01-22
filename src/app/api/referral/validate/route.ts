import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Apply strict rate limiting - 5 requests per minute for referral validation
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { promoCode } = await request.json();

    if (!promoCode) {
      return NextResponse.json(
        { error: "Promo код оруулна уу" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Нэвтэрч орно уу" },
        { status: 401 }
      );
    }

    const normalizedCode = promoCode.toUpperCase().trim();

    // Find referrer by promo code
    const { data: referrer, error: referrerError } = await supabase
      .from("profiles")
      .select("id, full_name, promo_code")
      .eq("promo_code", normalizedCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: "Promo код олдсонгүй" },
        { status: 400 }
      );
    }

    // Prevent self-referral
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: "Өөрийн promo код ашиглах боломжгүй" },
        { status: 400 }
      );
    }

    // Check if user already has a referrer
    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { error: "Та аль хэдийн бүртгүүлсэн байна" },
        { status: 400 }
      );
    }

    // Create referral relationship
    const { error: insertError } = await supabase.from("referrals").insert({
      user_id: user.id,
      referrer_id: referrer.id,
      promo_code_used: normalizedCode,
    });

    if (insertError) {
      console.error('Error creating referral:', insertError);
      return NextResponse.json(
        { error: "Referral үүсгэхэд алдаа гарлаа" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Promo код амжилттай ашиглагдлаа!",
      referrer_name: referrer.full_name || "Хэрэглэгч",
    });
  } catch (error) {
    console.error('Error in referral validation:', error);
    return NextResponse.json(
      { error: "Алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
