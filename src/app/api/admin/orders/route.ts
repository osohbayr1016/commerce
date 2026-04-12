import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function isAdmin() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();
  return profile?.role === "admin";
}

export async function GET(_req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Зөвхөн админ хандах эрхтэй" }, { status: 403 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id,total_amount,status,created_at,full_name,phone,email,address,city,district,zip,note,payment_method,payment_status,earned_xp,profiles(full_name),order_items(quantity)",
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Захиалга татахад алдаа гарлаа" }, { status: 500 });
    }

    const orders = (data || []).map((o: any) => ({
      ...o,
      customer_name: o.full_name || o.profiles?.full_name || "N/A",
      item_count: Array.isArray(o.order_items)
        ? o.order_items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)
        : 0,
    }));

    return NextResponse.json({ orders });
  } catch (e) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
