import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request, RateLimitPresets.GENEROUS);
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("id, images, image_color, brand_color")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  const res = NextResponse.json({
    id: product.id,
    images: product.images || [],
    imageColor: product.image_color,
    brandColor: product.brand_color,
  });
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );
  return res;
}