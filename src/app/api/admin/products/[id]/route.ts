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
    const { sizeStocks, ...productFields } = body;
    const { error } = await auth
      .adminClient!.from("products")
      .update(productFields)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Product update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await auth
      .adminClient!.from("product_variants")
      .delete()
      .eq("product_id", id)
      .is("color", null)
      .is("material", null);
    const productType = body.product_type as string | undefined;
    if (
      (productType === "shoes" || productType === "clothes") &&
      sizeStocks &&
      typeof sizeStocks === "object"
    ) {
      const rows = Object.entries(sizeStocks).map(([size, stock]) => ({
        product_id: id,
        color: null,
        material: null,
        size: parseInt(size, 10),
        stock: Math.max(0, Number(stock) || 0),
      }));
      if (rows.length) {
        const { error: insErr } = await auth
          .adminClient!.from("product_variants")
          .insert(rows);
        if (insErr) {
          console.error("Product variants insert error:", insErr);
          return NextResponse.json({ error: insErr.message }, { status: 500 });
        }
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/admin/products/[id]:", e);
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
      .adminClient!.from("products")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Product delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/products/[id]:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
