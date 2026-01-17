import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductRecommendations } from "@/lib/recommendations";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply generous rate limiting - 100 requests per minute for recommendations
  const rateLimitResponse = rateLimit(request, RateLimitPresets.GENEROUS);
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "6");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const recommendations = await getProductRecommendations(
      id,
      user?.id,
      limit
    );

    return NextResponse.json({ products: recommendations });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
