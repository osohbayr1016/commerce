import type { SupabaseClient } from "@supabase/supabase-js";
import type { SpinEligibility } from "@/types";

const COST_COINS = 100;
const UB_TZ = "Asia/Ulaanbaatar";

export async function computeEligibilityWithoutRpc(
  supabase: SupabaseClient,
  userId: string
): Promise<SpinEligibility> {
  let activeCount = 0;
  let coinBalance = 0;
  let lastSpinAt: string | null = null;

  const { count } = await supabase
    .from("spin_products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  activeCount = count ?? 0;

  const { data: profile } = await supabase
    .from("profiles")
    .select("coin_balance")
    .eq("id", userId)
    .single();
  coinBalance = (profile as { coin_balance?: number })?.coin_balance ?? 0;

  const { data: lastSpin } = await supabase
    .from("spin_history")
    .select("won_at")
    .eq("user_id", userId)
    .order("won_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  lastSpinAt = (lastSpin as { won_at?: string })?.won_at ?? null;

  const ubTodayStr = new Date().toLocaleDateString("en-CA", { timeZone: UB_TZ });
  const ubTodayStart = new Date(ubTodayStr + "T00:00:00+08:00");
  const alreadySpunToday =
    lastSpinAt && new Date(lastSpinAt).getTime() >= ubTodayStart.getTime();

  if (activeCount === 0) {
    return {
      can_spin: false,
      reason: "Одоогоор spin бүтээгдэхүүн алга байна",
      last_spin_at: lastSpinAt,
      next_spin_at: null,
      active_products_count: 0,
    };
  }

  if (coinBalance < COST_COINS) {
    return {
      can_spin: false,
      reason: "Хангалтгүй данс (100 coin шаардлагатай)",
      last_spin_at: lastSpinAt,
      next_spin_at: null,
      active_products_count: activeCount,
      required_coins: COST_COINS,
      current_balance: coinBalance,
    };
  }

  if (alreadySpunToday) {
    const nextDay = new Date(ubTodayStart);
    nextDay.setDate(nextDay.getDate() + 1);
    return {
      can_spin: false,
      reason: "Та өнөөдөр аль хэдийн spin эргүүлсэн байна",
      last_spin_at: lastSpinAt,
      next_spin_at: nextDay.toISOString(),
      active_products_count: activeCount,
    };
  }

  return {
    can_spin: true,
    reason: "Spin эргүүлэх боломжтой",
    last_spin_at: lastSpinAt,
    next_spin_at: null,
    active_products_count: activeCount,
    cost_coins: COST_COINS,
  };
}

export function fallbackEligibilityInactive(): SpinEligibility {
  return {
    can_spin: false,
    reason: "Одоогоор spin идэвхжээгүй байна",
    last_spin_at: null,
    next_spin_at: null,
    active_products_count: 0,
  };
}
