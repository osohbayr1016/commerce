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
  let query = supabase.from("products").select("id, brand, name_en, name_mn, title, price, original_price, discount, stock, sizes, subcategory, brand_color, image_color, images, created_at, category_id, categories(slug)", { count: "exact" });

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

  const products: Product[] = (data || []).map((p: any) => {
    let category: 'boots' | 'bag' = 'boots';
    
    if (p.categories?.slug) {
      category = p.categories.slug === 'bags' ? 'bag' : 'boots';
    } else if (p.subcategory) {
      category = p.subcategory.toLowerCase().includes("цүнх") ? "bag" : "boots";
    }
    
    return {
      id: p.id,
      brand: p.brand || "",
      nameEn: p.name_en || p.title || "",
      nameMn: p.name_mn || "",
      category,
      price: p.price || 0,
      originalPrice: p.original_price || p.price || 0,
      discount: p.discount,
      stock: p.stock || 0,
      sizes: p.sizes || [],
      brandColor: p.brand_color || "#F5F5F5",
      imageColor: p.image_color || "#FAFAFA",
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [],
    };
  });

  return { data: products, error: null, count: count || 0 };
}

let brandsCache: { data: string[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getUniqueBrands() {
  const now = Date.now();
  if (brandsCache && now - brandsCache.timestamp < CACHE_DURATION) {
    return brandsCache.data;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null)
    .limit(1000);

  if (error) {
    return brandsCache?.data || [];
  }

  const brands = Array.from(
    new Set((data || []).map((p: any) => p.brand).filter(Boolean))
  ).sort() as string[];

  brandsCache = { data: brands, timestamp: now };
  return brands;
}

let sizesCache: { data: number[]; timestamp: number } | null = null;

export async function getAvailableSizes() {
  const now = Date.now();
  if (sizesCache && now - sizesCache.timestamp < CACHE_DURATION) {
    return sizesCache.data;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("sizes")
    .limit(1000);

  if (error) {
    return sizesCache?.data || [];
  }

  const allSizes = new Set<number>();
  (data || []).forEach((p: any) => {
    if (Array.isArray(p.sizes)) {
      p.sizes.forEach((size: number) => allSizes.add(size));
    }
  });

  const sizes = Array.from(allSizes).sort((a, b) => a - b);
  sizesCache = { data: sizes, timestamp: now };
  return sizes;
}

let priceRangeCache: { data: { min: number; max: number }; timestamp: number } | null = null;

export async function getPriceRange() {
  const now = Date.now();
  if (priceRangeCache && now - priceRangeCache.timestamp < CACHE_DURATION) {
    return priceRangeCache.data;
  }

  const supabase = await createClient();
  const { data: minData, error: minError } = await supabase
    .from("products")
    .select("price")
    .order("price", { ascending: true })
    .limit(1);

  const { data: maxData, error: maxError } = await supabase
    .from("products")
    .select("price")
    .order("price", { ascending: false })
    .limit(1);

  if (minError || maxError || !minData || !maxData) {
    return priceRangeCache?.data || { min: 0, max: 1000000 };
  }

  const range = {
    min: minData[0]?.price || 0,
    max: maxData[0]?.price || 1000000,
  };

  priceRangeCache = { data: range, timestamp: now };
  return range;
}
