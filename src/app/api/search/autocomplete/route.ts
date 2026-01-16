import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name_en, name_mn, title, brand, price, images, slug")
    .or(
      `name_en.ilike.%${query}%,name_mn.ilike.%${query}%,title.ilike.%${query}%,brand.ilike.%${query}%`
    )
    .limit(8)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (data || []).map((product: any) => ({
    id: product.id,
    name: product.name_en || product.title || product.name_mn || "",
    nameMn: product.name_mn || "",
    brand: product.brand || "",
    price: product.price || 0,
    image: Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null,
  }));

  return NextResponse.json({ results });
}
