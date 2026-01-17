import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function GET(request: Request) {
  // Apply rate limiting - 30 requests per minute
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STANDARD);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      products (
        id,
        name_en,
        name_mn,
        title,
        price,
        original_price,
        discount,
        brand,
        brand_color,
        image_color,
        images,
        stock
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  
  const items = (cartItems || [])
    .filter((item: any) => item.products) 
    .map((item: any) => {
      const product = item.products;
      const productName = product?.name_en || product?.title || product?.name_mn || "";
      return {
        id: item.product_id,
        name: productName,
        price: product?.price || 0,
        originalPrice: product?.original_price || product?.price || 0,
        quantity: item.quantity,
        slug: `${product?.brand || ""}-${productName}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        brand: product?.brand,
        imageColor: product?.image_color,
        brandColor: product?.brand_color,
        images: product?.images || [],
        size: item.size || undefined,
      };
    });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  // Apply rate limiting - 30 requests per minute
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STANDARD);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { product_id, quantity, size } = body;

  if (!product_id || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  
  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", product_id)
    .maybeSingle();

  if (!product || (product.stock ?? 0) < quantity) {
    return NextResponse.json(
      { error: "Insufficient stock" },
      { status: 400 }
    );
  }

  
  
  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      {
        user_id: user.id,
        product_id,
        quantity,
        size: size || null,
      },
      {
        onConflict: "user_id,product_id,size",
      }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function PUT(request: Request) {
  // Apply rate limiting - 30 requests per minute
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STANDARD);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { product_id, quantity, size } = body;

  if (!product_id || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  
  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", product_id)
    .maybeSingle();

  if (!product || (product.stock ?? 0) < quantity) {
    return NextResponse.json(
      { error: "Insufficient stock" },
      { status: 400 }
    );
  }

  
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .eq("size", size || null)
    .maybeSingle();

  if (!existingItem) {
    return NextResponse.json(
      { error: "Cart item not found" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", existingItem.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request) {
  // Apply rate limiting - 30 requests per minute
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STANDARD);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get("product_id");
  const size = searchParams.get("size");

  if (!product_id) {
    return NextResponse.json(
      { error: "Product ID required" },
      { status: 400 }
    );
  }

  let query = supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", product_id);

  if (size) {
    query = query.eq("size", parseInt(size));
  } else {
    query = query.is("size", null);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
