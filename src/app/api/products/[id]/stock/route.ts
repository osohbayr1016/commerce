import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("stock, name_en, name_mn, title")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    return NextResponse.json(
      { error: "Product not found", stock: 0, available: false, name: "" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    stock: product.stock ?? 0,
    available: (product.stock ?? 0) > 0,
    name: product.name_en || product.name_mn || product.title || "",
  });
}
