import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";

export interface ProductFilters {
  brands?: string[];
  sizes?: number[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  categoryId?: number;
  searchQuery?: string;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "discount";

export async function getProductsWithFilters(
  filters: ProductFilters = {},
  sort: SortOption = "newest",
  limit?: number,
  offset?: number
) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*", { count: "exact" });

  if (filters.brands && filters.brands.length > 0) {
    query = query.in("brand", filters.brands);
  }

  if (filters.sizes && filters.sizes.length > 0) {
    query = query.overlaps("sizes", filters.sizes);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.inStockOnly) {
    query = query.gt("stock", 0);
  }

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.searchQuery) {
    query = query.or(
      `name_en.ilike.%${filters.searchQuery}%,name_mn.ilike.%${filters.searchQuery}%,title.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%`
    );
  }

  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "discount":
      query = query.order("discount", { ascending: false });
      break;
    case "popularity":
      query = query.order("created_at", { ascending: false });
      break;
  }

  if (limit !== undefined) {
    if (offset !== undefined) {
      query = query.range(offset, offset + limit - 1);
    } else {
      query = query.limit(limit);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    return { data: [], error, count: 0 };
  }

  const products: Product[] = (data || []).map((p: any) => ({
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

  return { data: products, error: null, count: count || 0 };
}

export async function getUniqueBrands() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  if (error) {
    return [];
  }

  const brands = Array.from(
    new Set((data || []).map((p: any) => p.brand).filter(Boolean))
  ).sort() as string[];

  return brands;
}

export async function getAvailableSizes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("sizes");

  if (error) {
    return [];
  }

  const allSizes = new Set<number>();
  (data || []).forEach((p: any) => {
    if (Array.isArray(p.sizes)) {
      p.sizes.forEach((size: number) => allSizes.add(size));
    }
  });

  return Array.from(allSizes).sort((a, b) => a - b);
}

export async function getPriceRange() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("price")
    .order("price", { ascending: true })
    .limit(1);

  const { data: maxData } = await supabase
    .from("products")
    .select("price")
    .order("price", { ascending: false })
    .limit(1);

  if (error || !data || !maxData) {
    return { min: 0, max: 1000000 };
  }

  return {
    min: data[0]?.price || 0,
    max: maxData[0]?.price || 1000000,
  };
}
