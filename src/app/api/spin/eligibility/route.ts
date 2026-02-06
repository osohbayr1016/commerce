import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  computeEligibilityWithoutRpc,
  fallbackEligibilityInactive,
} from "@/lib/spin-eligibility";
import type { SpinEligibility } from "@/types";

function isTableOrRpcMissing(err: { code?: string; message?: string }): boolean {
  return (
    err.code === "PGRST202" ||
    err.code === "PGRST205" ||
    (typeof err.message === "string" &&
      (err.message.includes("Could not find") || err.message.includes("does not exist")))
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    const { data: eligibility, error } = await supabase.rpc("can_user_spin_today", {
      p_user_id: user.id,
    });

    if (!error) {
      const result: SpinEligibility = {
        can_spin: eligibility?.can_spin ?? false,
        reason: eligibility?.reason ?? "Төлөв тодорхойгүй",
        last_spin_at: eligibility?.last_spin_at || null,
        next_spin_at: eligibility?.next_spin_at || null,
        active_products_count: eligibility?.active_products_count ?? 0,
        cost_coins: eligibility?.cost_coins ?? undefined,
        required_coins: eligibility?.required_coins ?? undefined,
        current_balance: eligibility?.current_balance ?? undefined,
      };
      return NextResponse.json(result, { status: 200 });
    }

    if (!isTableOrRpcMissing(error)) {
      console.error("Error checking spin eligibility:", error);
      return NextResponse.json(
        { error: "Эрх шалгахад алдаа гарлаа" },
        { status: 500 },
      );
    }

    const result = await computeEligibilityWithoutRpc(supabase, user.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/spin/eligibility:", error);
    return NextResponse.json(fallbackEligibilityInactive(), { status: 200 });
  }
}
