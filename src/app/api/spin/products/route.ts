import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Public: get active spin products for the wheel (no auth required)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: rows, error } = await supabase
      .from("spin_products")
      .select(
        `
        *,
        product:products (
          id,
          name_mn,
          name_en,
          price,
          images,
          stock,
          brand
        )
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      const isTableMissing =
        error.code === "PGRST205" ||
        (error.message && error.message.includes("Could not find the table"));
      if (isTableMissing) return NextResponse.json([]);
      console.error("Error fetching spin products:", error);
      return NextResponse.json([]);
    }

    const list = rows || [];
    const withImageUrl = list.map(
      (sp: { product?: { images?: string[]; [k: string]: unknown } }) => {
        const p = sp.product as
          | { images?: string[]; image_url?: string }
          | undefined;
        if (
          p &&
          Array.isArray(p.images) &&
          p.images.length > 0 &&
          !p.image_url
        ) {
          return { ...sp, product: { ...p, image_url: p.images[0] } };
        }
        return sp;
      },
    );

    return NextResponse.json(withImageUrl);
  } catch (e) {
    console.error("GET /api/spin/products:", e);
    return NextResponse.json([]);
  }
}
