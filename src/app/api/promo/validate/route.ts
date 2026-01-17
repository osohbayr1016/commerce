import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Apply strict rate limiting - 5 requests per minute for promo code validation
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { code, userId, orderAmount } = await request.json();

    if (!code || !userId || !orderAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("validate_promo_code", {
      p_code: code,
      p_user_id: userId,
      p_order_amount: orderAmount,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to validate promo code" },
        { status: 500 }
      );
    }

    const result = data[0];

    if (!result.is_valid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      discountAmount: result.discount_amount,
      promoCodeId: result.promo_code_id,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
