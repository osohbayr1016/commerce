import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED = new Set(["pending", "confirmed", "delivered", "cancelled"]);

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Зөвхөн админ хандах эрхтэй" }, { status: 403 });
    }
    const { id } = await params;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "*,profiles(full_name),order_items(id,product_id,quantity,size,price_at_purchase,products(id,name_mn,name_en,brand,images))",
      )
      .eq("id", id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Захиалга олдсонгүй" }, { status: 404 });
    }
    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Зөвхөн админ хандах эрхтэй" }, { status: 403 });
    }
    const body = await req.json().catch(() => ({}));
    const status = typeof body.status === "string" ? body.status : "";
    if (!ALLOWED.has(status)) {
      return NextResponse.json({ error: "Төлөв буруу байна" }, { status: 400 });
    }
    const { id } = await params;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("id,status")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Захиалга шинэчилж чадсангүй" }, { status: 500 });
    }
    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
