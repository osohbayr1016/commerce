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
    const updatePayload: Record<string, unknown> = {};
    if (body.name !== undefined) updatePayload.name = String(body.name).trim();
    if (body.display_order !== undefined)
      updatePayload.display_order = Number(body.display_order) || 0;
    if (Object.keys(updatePayload).length === 0)
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    const { error } = await auth
      .adminClient!.from("brands")
      .update(updatePayload)
      .eq("id", parseInt(id, 10))
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
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/admin/brands/[id]:", e);
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
      .adminClient!.from("brands")
      .delete()
      .eq("id", parseInt(id, 10));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/brands/[id]:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
