import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Apply strict rate limiting - 5 requests per minute for referral validation
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { referralCode, userId } = await request.json();

    if (!referralCode || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: referrer, error: referrerError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("referral_code", referralCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    if (referrer.id === userId) {
      return NextResponse.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      );
    }

    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("id")
      .eq("referrer_id", referrer.id)
      .eq("referred_id", userId)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { error: "Referral already exists" },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase.from("referrals").insert({
      referrer_id: referrer.id,
      referred_id: userId,
      status: "pending",
      referrer_reward_xp: 500,
      referred_reward_xp: 500,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create referral" },
        { status: 500 }
      );
    }

    const { error: xpError } = await supabase.rpc("award_xp", {
      p_user_id: userId,
      p_amount: 500,
      p_source: "referral_signup",
      p_description: "Welcome bonus for using referral code",
    });

    return NextResponse.json({
      success: true,
      message: "Referral applied successfully",
      bonus: 500,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
