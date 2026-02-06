import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Нэвтэрч орно уу" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Зөвхөн админ хандах эрхтэй" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Хайлтын үг 2-оос дээш тэмдэгт байх ёстой" },
        { status: 400 },
      );
    }

    // Prefer RPC so search by email works (auth.users join); no profiles.email needed
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "search_users_for_admin",
      {
        p_query: query,
      },
    );

    const rpcUsers =
      rpcData && typeof rpcData === "object" && "users" in rpcData
        ? (rpcData as { users: unknown[] }).users
        : null;
    if (!rpcError && Array.isArray(rpcUsers)) {
      return NextResponse.json({
        users: rpcUsers,
        total:
          typeof (rpcData as { total?: number })?.total === "number"
            ? (rpcData as { total: number }).total
            : rpcUsers.length,
      });
    }

    // Fallback: search by full_name and promo_code only (no profiles.email)
    const safeQuery = query.replace(/%/g, "\\%").replace(/_/g, "\\_");
    const { data: rows, error: searchError } = await supabase
      .from("profiles")
      .select("id, full_name, promo_code, total_referrals, is_top6")
      .or(`promo_code.ilike.%${safeQuery}%,full_name.ilike.%${safeQuery}%`)
      .eq("is_top6", false)
      .limit(50);

    if (searchError) {
      console.error("Error searching users:", searchError);
      return NextResponse.json(
        { error: "Хайлтад алдаа гарлаа" },
        { status: 500 },
      );
    }

    const list = rows || [];
    let enriched: {
      id: string;
      full_name: string | null;
      promo_code: string | null;
      total_referrals?: number;
      is_top6?: boolean;
      email?: string | null;
    }[] = [];
    try {
      const admin = createAdminClient();
      enriched = await Promise.all(
        list.map(async (r) => {
          try {
            const { data } = await admin.auth.admin.getUserById(r.id);
            const email = data?.user?.email ?? null;
            return { ...r, email };
          } catch {
            return { ...r, email: null };
          }
        }),
      );
    } catch {
      enriched = list.map((r) => ({ ...r, email: null }));
    }

    return NextResponse.json({
      users: enriched.slice(0, 20),
      total: enriched.length,
    });
  } catch (error) {
    console.error("Error in user search:", error);
    return NextResponse.json(
      { error: "Алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
