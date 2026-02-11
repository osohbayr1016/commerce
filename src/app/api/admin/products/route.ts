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

export async function GET(_req: NextRequest) {
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
    const { data: rows, error } = await supabase
      .from("products")
      .select("id, name_mn, name_en, title, brand, price, images")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("Error listing products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const products = (rows || []).map(
      (p: { images?: string[]; [k: string]: unknown }) => ({
        ...p,
        image_url:
          Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      }),
    );
    return NextResponse.json({ products });
  } catch (e) {
    console.error("GET /api/admin/products:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

const PRODUCT_INSERT_COLUMNS = [
  "name_en",
  "name_mn",
  "title",
  "brand",
  "sku",
  "price",
  "original_price",
  "discount",
  "stock",
  "sizes",
  "description",
  "subcategory",
  "category_id",
  "brand_color",
  "image_color",
  "has_financing",
  "images",
] as const;

export function pickProductPayload(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of PRODUCT_INSERT_COLUMNS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const body = await req.json().catch(() => ({}));
    const { sizeStocks } = body;
    const productPayload = pickProductPayload(body);
    const { data: product, error } = await auth
      .adminClient!.from("products")
      .insert(productPayload)
      .select("id")
      .single();
    if (error) {
      console.error("Product create error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const productType = body.product_type as string | undefined;
    if (
      product?.id &&
      (productType === "shoes" || productType === "clothes") &&
      sizeStocks &&
      typeof sizeStocks === "object"
    ) {
      const rows = Object.entries(sizeStocks).map(([size, stock]) => ({
        product_id: product.id,
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
    return NextResponse.json({ success: true, id: product?.id });
  } catch (e) {
    console.error("POST /api/admin/products:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
