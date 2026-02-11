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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    if (!id)
      return NextResponse.json({ error: "ID шаардлагатай" }, { status: 400 });
    const body = await req.json().catch(() => ({}));
    const allowedKeys = [
      "name",
      "name_en",
      "name_mn",
      "slug",
      "is_active",
      "display_order",
    ] as const;
    const updatePayload: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) updatePayload[key] = body[key];
    }
    if (Object.keys(updatePayload).length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    const { error } = await auth
      .adminClient!.from("categories")
      .update(updatePayload)
      .eq("id", parseInt(id, 10))
      .select()
      .single();
    if (error) {
      console.error("Category update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/admin/categories/[id]:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    if (!id)
      return NextResponse.json({ error: "ID шаардлагатай" }, { status: 400 });
    const { error } = await auth
      .adminClient!.from("categories")
      .delete()
      .eq("id", parseInt(id, 10));
    if (error) {
      console.error("Category delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/categories/[id]:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
