import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  
  const { data: reviews, error } = await supabase
    .from("product_reviews")
    .select(
      `
      *,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `
    )
    .eq("product_id", id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  
  const { count } = await supabase
    .from("product_reviews")
    .select("*", { count: "exact", head: true })
    .eq("product_id", id);

  
  const { data: avgData } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", id);

  const avgRating =
    avgData && avgData.length > 0
      ? avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length
      : 0;

  return NextResponse.json({
    reviews: reviews || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: count || 0,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rating, review_text } = body;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  
  try {
    const { data: hasPurchased, error: rpcError } = await supabase.rpc(
      "has_user_purchased_product",
      {
        p_user_id: user.id,
        p_product_id: id,
      }
    );

    if (rpcError) {
      
    } else if (!hasPurchased) {
      return NextResponse.json(
        { error: "You must purchase this product before reviewing" },
        { status: 403 }
      );
    }
  } catch (error) {
  }

  const { data: existing } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("product_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("product_reviews")
      .update({
        rating,
        review_text: review_text || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review: data });
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id: id,
      user_id: user.id,
      rating,
      review_text: review_text || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: data }, { status: 201 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { review_id, rating, review_text } = body;

  const { data: review } = await supabase
    .from("product_reviews")
    .select("user_id, rating, review_text")
    .eq("id", review_id)
    .eq("product_id", id)
    .single();

  if (!review || review.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .update({
      rating: rating !== undefined ? rating : review.rating,
      review_text: review_text !== undefined ? review_text : review.review_text,
      updated_at: new Date().toISOString(),
    })
    .eq("id", review_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const review_id = searchParams.get("review_id");

  if (!review_id) {
    return NextResponse.json(
      { error: "Review ID required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  
  const { data: review } = await supabase
    .from("product_reviews")
    .select("user_id")
    .eq("id", review_id)
    .eq("product_id", id)
    .maybeSingle();

  if (!review || review.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("product_reviews")
    .delete()
    .eq("id", review_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
