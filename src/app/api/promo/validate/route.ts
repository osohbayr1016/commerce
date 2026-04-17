import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

const PROMO_DISCOUNT_PERCENT = 5; // buyer gets 5% off when using a valid promo code

export async function POST(request: Request) {
  // Apply strict rate limiting
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

    // Find the profile that owns this promo code
    const { data: referrer, error: referrerError } = await supabase
      .from("profiles")
      .select("id, full_name, promo_code")
      .eq("promo_code", String(code).toUpperCase().trim())
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: "Promo код олдсонгүй" },
        { status: 400 }
      );
    }

    // Prevent self-use — user cannot apply their own promo code
    if (referrer.id === userId) {
      return NextResponse.json(
        { error: "Өөрийн promo код ашиглах боломжгүй" },
        { status: 400 }
      );
    }

    // Calculate discount: 5% off the order amount
    const discountAmount = Math.floor(
      (orderAmount * PROMO_DISCOUNT_PERCENT) / 100
    );

    return NextResponse.json({
      success: true,
      discountAmount,
      promoCodeId: referrer.id,
      message: `${referrer.full_name || "Хэрэглэгч"}-ийн код хүлээн авлаа! ${PROMO_DISCOUNT_PERCENT}% хөнгөлөлт авлаа.`,
    });
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
