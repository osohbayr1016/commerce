import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      error: NextResponse.json({ error: "Нэвтэрч орно уу" }, { status: 401 }),
    };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Зөвхөн админ хандах эрхтэй" },
        { status: 403 },
      ),
    };
  }
  try {
    return { adminClient: createAdminClient() };
  } catch (e) {
    console.error("Admin client init failed:", e);
    return {
      error: NextResponse.json({ error: "Тохиргооны алдаа" }, { status: 503 }),
    };
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("id, name, display_order")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("GET /api/admin/brands:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim();
    if (!name)
      return NextResponse.json({ error: "Нэр шаардлагатай" }, { status: 400 });
    const display_order = body.display_order ?? 0;
    const { data, error } = await auth
      .adminClient!.from("brands")
      .insert({ name, display_order })
      .select()
      .single();
    if (error) {
      if (error.code === "23505")
        return NextResponse.json(
          { error: "Ийм нэртэй брэнд байна" },
          { status: 400 },
        );
      throw error;
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("POST /api/admin/brands:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
