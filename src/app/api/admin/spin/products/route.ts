import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// GET /api/admin/spin/products
// =====================================================
// Get all spin products (active and inactive) with product details
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Админ эрх шаардлагатай" },
        { status: 403 },
      );
    }

    // Fetch all spin products with product details (products has images, not image_url)
    const { data: spinProducts, error } = await supabase
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
      .order("created_at", { ascending: false });

    if (error) {
      const isTableMissing =
        error.code === "PGRST205" ||
        (error.message && error.message.includes("Could not find the table"));
      if (isTableMissing) {
        return NextResponse.json([], { status: 200 });
      }
      console.error("Error fetching spin products:", error);
      return NextResponse.json(
        { error: "Spin бүтээгдэхүүн татах үед алдаа гарлаа" },
        { status: 500 },
      );
    }

    const list = spinProducts || [];
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

    return NextResponse.json(withImageUrl, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/spin/products:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

// =====================================================
// POST /api/admin/spin/products
// =====================================================
// Add a new product to the spin wheel
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Админ эрх шаардлагатай" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await req.json();
    const { product_id, display_name, image_url, is_active = true } = body;

    // Validate required fields
    if (!product_id) {
      return NextResponse.json(
        { error: "Бүтээгдэхүүний ID шаардлагатай" },
        { status: 400 },
      );
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name_mn, name_en")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Бүтээгдэхүүн олдсонгүй" },
        { status: 404 },
      );
    }

    // Check if product is already in spin wheel
    const { data: existing } = await supabase
      .from("spin_products")
      .select("id")
      .eq("product_id", product_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Энэ бүтээгдэхүүн аль хэдийн spin wheel дээр байна" },
        { status: 409 },
      );
    }

    // Insert new spin product (products has images, not image_url)
    const { data: newSpinProduct, error: insertError } = await supabase
      .from("spin_products")
      .insert({
        product_id,
        display_name: display_name || null,
        image_url: image_url || null,
        is_active,
        added_by: user.id,
      })
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
      .single();

    if (insertError) {
      const isTableMissing =
        insertError.code === "PGRST205" ||
        (insertError.message &&
          insertError.message.includes("Could not find the table"));
      if (isTableMissing) {
        return NextResponse.json(
          {
            error:
              "Spin хүснэгт байхгүй байна. Supabase дээр migration 20260206000000_ensure_spin_tables ажиллуулна уу.",
          },
          { status: 503 },
        );
      }
      console.error("Error inserting spin product:", insertError);
      return NextResponse.json(
        { error: "Spin бүтээгдэхүүн нэмэх үед алдаа гарлаа" },
        { status: 500 },
      );
    }

    const out = newSpinProduct as {
      product?: { images?: string[]; image_url?: string };
    };
    if (
      out?.product &&
      Array.isArray(out.product.images) &&
      out.product.images.length > 0 &&
      !out.product.image_url
    ) {
      out.product.image_url = out.product.images[0];
    }
    return NextResponse.json(out, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/spin/products:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

// =====================================================
// PATCH /api/admin/spin/products
// =====================================================
// Update a spin product
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Админ эрх шаардлагатай" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await req.json();
    const { id, display_name, image_url, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Spin бүтээгдэхүүний ID шаардлагатай" },
        { status: 400 },
      );
    }

    // Build update object
    const updates: any = {};
    if (display_name !== undefined) updates.display_name = display_name;
    if (image_url !== undefined) updates.image_url = image_url;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Шинэчлэх өгөгдөл шаардлагатай" },
        { status: 400 },
      );
    }

    // Update spin product
    const { data: updated, error: updateError } = await supabase
      .from("spin_products")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        product:products (
          id,
          name_mn,
          name_en,
          price,
          image_url,
          stock,
          brand
        )
      `,
      )
      .single();

    if (updateError) {
      console.error("Error updating spin product:", updateError);
      return NextResponse.json(
        { error: "Spin бүтээгдэхүүн шинэчлэх үед алдаа гарлаа" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/admin/spin/products:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

// =====================================================
// DELETE /api/admin/spin/products
// =====================================================
// Remove a product from the spin wheel
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Админ эрх шаардлагатай" },
        { status: 403 },
      );
    }

    // Get ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Spin бүтээгдэхүүний ID шаардлагатай" },
        { status: 400 },
      );
    }

    // Delete spin product
    const { error: deleteError } = await supabase
      .from("spin_products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting spin product:", deleteError);
      return NextResponse.json(
        { error: "Spin бүтээгдэхүүн устгах үед алдаа гарлаа" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Амжилттай устгагдлаа" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /api/admin/spin/products:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}
