import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Compute spin statistics in API (no RPC dependency)
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Админ эрх шаардлагатай" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const days = Math.min(
      365,
      Math.max(1, parseInt(searchParams.get("days") || "30", 10)),
    );
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    const { data: rows, error } = await supabase
      .from("spin_history")
      .select("id, product_id, amount_paid, user_id")
      .gte("won_at", sinceIso);

    if (error) {
      const isTableMissing =
        error.code === "PGRST205" ||
        (error.message && error.message.includes("Could not find the table"));
      if (isTableMissing) {
        return NextResponse.json(
          {
            period_days: days,
            total_spins: 0,
            total_revenue_mnt: 0,
            unique_users: 0,
            avg_spins_per_user: 0,
            most_won_products: [],
          },
          { status: 200 },
        );
      }
      console.error("Error fetching spin statistics:", error);
      return NextResponse.json(
        { error: "Статистик татах үед алдаа гарлаа" },
        { status: 500 },
      );
    }

    const list = rows || [];
    const totalSpins = list.length;
    const totalRevenueMnt = list.reduce((s, r) => s + (r.amount_paid ?? 0), 0);
    const uniqueUserIds = new Set(list.map((r) => r.user_id));
    const uniqueUsers = uniqueUserIds.size;
    const avgSpinsPerUser =
      uniqueUsers > 0 ? Math.round((totalSpins / uniqueUsers) * 100) / 100 : 0;

    const byProduct: Record<string, { count: number }> = {};
    list.forEach((r) => {
      if (r.product_id) {
        byProduct[r.product_id] = byProduct[r.product_id] || { count: 0 };
        byProduct[r.product_id].count += 1;
      }
    });
    const topProductIds = Object.entries(byProduct)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([id]) => id);

    let mostWonProducts: {
      id: string;
      name: string | null;
      image_url: string | null;
      win_count: number;
      win_percentage: number;
    }[] = [];
    if (topProductIds.length > 0) {
      const { data: products } = await supabase
        .from("products")
        .select("id, name_en, name_mn, images")
        .in("id", topProductIds);
      const productMap = new Map((products || []).map((p) => [p.id, p]));
      mostWonProducts = topProductIds.map((id) => {
        const p = productMap.get(id);
        const count = byProduct[id]?.count ?? 0;
        const winPercentage =
          totalSpins > 0 ? Math.round((count / totalSpins) * 10000) / 100 : 0;
        const img = p?.images;
        const imageUrl = Array.isArray(img) && img.length > 0 ? img[0] : null;
        return {
          id,
          name:
            (p as { name_mn?: string; name_en?: string })?.name_mn ??
            (p as { name_en?: string })?.name_en ??
            null,
          image_url: imageUrl,
          win_count: count,
          win_percentage: winPercentage,
        };
      });
    }

    const statistics = {
      period_days: days,
      total_spins: totalSpins,
      total_revenue_mnt: totalRevenueMnt,
      unique_users: uniqueUsers,
      avg_spins_per_user: avgSpinsPerUser,
      most_won_products: mostWonProducts,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/spin/statistics:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}
