import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";

interface RecommendationScore {
  productId: string;
  score: number;
}

export async function getProductRecommendations(
  productId: string,
  userId?: string,
  limit: number = 6
): Promise<Product[]> {
  const supabase = await createClient();
  const scores: Map<string, number> = new Map();

  const { data: ordersWithProduct } = await supabase
    .from("order_items")
    .select("order_id")
    .eq("product_id", productId);

  if (ordersWithProduct && ordersWithProduct.length > 0) {
    const orderIds = ordersWithProduct.map((o) => o.order_id);

    const { data: boughtTogether } = await supabase
      .from("order_items")
      .select("product_id")
      .in("order_id", orderIds)
      .neq("product_id", productId);

    if (boughtTogether) {
      boughtTogether.forEach((item) => {
        const current = scores.get(item.product_id) || 0;
        scores.set(item.product_id, current + 10);
      });
    }
  }

  try {
    const { data: viewsWithProduct } = await supabase
      .from("product_views")
      .select("user_id, session_id")
      .eq("product_id", productId)
      .limit(100);

    if (viewsWithProduct && viewsWithProduct.length > 0) {
      const userIds = Array.from(
        new Set(viewsWithProduct.map((v) => v.user_id).filter(Boolean))
      );
      const sessionIds = Array.from(
        new Set(viewsWithProduct.map((v) => v.session_id).filter(Boolean))
      );

      if (userIds.length > 0) {
        const { data: viewedTogether } = await supabase
          .from("product_views")
          .select("product_id")
          .in("user_id", userIds)
          .neq("product_id", productId)
          .limit(200);

        if (viewedTogether) {
          viewedTogether.forEach((item) => {
            const current = scores.get(item.product_id) || 0;
            scores.set(item.product_id, current + 5);
          });
        }
      }

      if (sessionIds.length > 0 && sessionIds.length < 100) {
        const { data: sessionViewedTogether } = await supabase
          .from("product_views")
          .select("product_id")
          .in("session_id", sessionIds)
          .neq("product_id", productId)
          .limit(200);

        if (sessionViewedTogether) {
          sessionViewedTogether.forEach((item) => {
            const current = scores.get(item.product_id) || 0;
            scores.set(item.product_id, current + 5);
          });
        }
      }
    }
  } catch (error) {
  }

  const { data: currentProduct } = await supabase
    .from("products")
    .select("category_id, brand, subcategory")
    .eq("id", productId)
    .single();

  if (currentProduct) {
    if (currentProduct.category_id) {
      const { data: sameCategory } = await supabase
        .from("products")
        .select("id")
        .eq("category_id", currentProduct.category_id)
        .neq("id", productId)
        .limit(50);

      if (sameCategory) {
        sameCategory.forEach((item) => {
          const current = scores.get(item.id) || 0;
          scores.set(item.id, current + 3);
        });
      }
    }

    if (currentProduct.brand) {
      const { data: sameBrand } = await supabase
        .from("products")
        .select("id")
        .eq("brand", currentProduct.brand)
        .neq("id", productId)
        .limit(50);

      if (sameBrand) {
        sameBrand.forEach((item) => {
          const current = scores.get(item.id) || 0;
          scores.set(item.id, current + 2);
        });
      }
    }
  }

  if (userId) {
    const { data: recentlyViewed } = await supabase
      .from("product_views")
      .select("product_id")
      .eq("user_id", userId)
      .neq("product_id", productId)
      .order("viewed_at", { ascending: false })
      .limit(20);

    if (recentlyViewed) {
      recentlyViewed.forEach((item) => {
        const current = scores.get(item.product_id) || 0;
        scores.set(item.product_id, current + 1);
      });
    }
  }

  const sortedScores: RecommendationScore[] = Array.from(scores.entries())
    .map(([productId, score]) => ({ productId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (sortedScores.length === 0) {
    const { data: currentProduct } = await supabase
      .from("products")
      .select("category_id, brand")
      .eq("id", productId)
      .single();

    if (currentProduct?.category_id) {
      const { data: fallbackProducts } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", currentProduct.category_id)
        .neq("id", productId)
        .gt("stock", 0)
        .limit(limit);

      if (fallbackProducts && fallbackProducts.length > 0) {
        return fallbackProducts.map((p: any) => ({
          id: p.id,
          brand: p.brand || "",
          nameEn: p.name_en || p.title || "",
          nameMn: p.name_mn || "",
          category: p.subcategory?.toLowerCase().includes("цүнх") ? "bag" : "boots",
          price: p.price || 0,
          originalPrice: p.original_price || p.price || 0,
          discount: p.discount,
          stock: p.stock || 0,
          sizes: p.sizes || [],
          brandColor: p.brand_color || "#F5F5F5",
          imageColor: p.image_color || "#FAFAFA",
          images: p.images || [],
        }));
      }
    }
    return [];
  }

  const productIds = sortedScores.map((s) => s.productId);

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .gt("stock", 0);

  if (error || !products || products.length === 0) {
    return [];
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderedProducts = sortedScores
    .map((s) => productMap.get(s.productId))
    .filter(Boolean) as any[];

  return orderedProducts.map((p) => ({
    id: p.id,
    brand: p.brand || "",
    nameEn: p.name_en || p.title || "",
    nameMn: p.name_mn || "",
    category: p.subcategory?.toLowerCase().includes("цүнх") ? "bag" : "boots",
    price: p.price || 0,
    originalPrice: p.original_price || p.price || 0,
    discount: p.discount,
    stock: p.stock || 0,
    sizes: p.sizes || [],
    brandColor: p.brand_color || "#F5F5F5",
    imageColor: p.image_color || "#FAFAFA",
    images: p.images || [],
  }));
}
