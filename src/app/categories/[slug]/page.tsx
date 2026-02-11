import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductSection from "@/components/Products/ProductSection";
import Breadcrumb from "@/components/ProductDetail/Breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import MainNav from "@/components/Header/MainNav";
import Footer from "@/components/Footer/Footer";
import ProductFilters from "@/components/Products/ProductFilters";
import ProductSort from "@/components/Products/ProductSort";
import PaginationClient from "@/components/ui/PaginationClient";
import {
  getProductsWithFilters,
  getUniqueBrands,
  getAvailableSizes,
  getPriceRange,
  type SortOption,
} from "@/lib/products";
import { Product } from "@/data/mockProducts";
import { Category } from "@/types";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    brands?: string;
    sizes?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  let category: Category | null = null;
  let products: Product[] = [];
  let totalCount = 0;
  let totalPages = 1;
  let brands: string[] = [];
  let sizes: number[] = [];
  let priceRange = { min: 0, max: 1000000 };
  let categoryName = "Ангилал";
  let currentPage = 1;

  try {
    const { slug } = await params;
    
    if (!slug || typeof slug !== "string") {
      notFound();
    }

    const supabase = await createClient();
    
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name, name_en, name_mn, slug, is_active, display_order")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (categoryError || !categoryData) {
      notFound();
    }

    category = categoryData as Category;

    if (!category || !category.id) {
      notFound();
    }

    categoryName = category.name_mn || category.name_en || category.name || "Ангилал";

    const paramsData = searchParams ? await searchParams : ({} as {
      brands?: string;
      sizes?: string;
      minPrice?: string;
      maxPrice?: string;
      inStock?: string;
      sort?: string;
      page?: string;
    });
    currentPage = Math.max(1, parseInt(paramsData?.page || "1") || 1);
    const limit = 24;
    const offset = (currentPage - 1) * limit;

    const filters = {
      categoryId: category.id,
      brands: paramsData?.brands?.split(",").filter(Boolean) || [],
      sizes: paramsData?.sizes?.split(",").map(Number).filter((n) => !isNaN(n) && n > 0) || [],
      minPrice: paramsData?.minPrice ? Number(paramsData.minPrice) : undefined,
      maxPrice: paramsData?.maxPrice ? Number(paramsData.maxPrice) : undefined,
      inStockOnly: paramsData?.inStock === "true",
    };

    if (filters.minPrice !== undefined && isNaN(filters.minPrice)) {
      filters.minPrice = undefined;
    }
    if (filters.maxPrice !== undefined && isNaN(filters.maxPrice)) {
      filters.maxPrice = undefined;
    }

    const sort = (paramsData?.sort as SortOption) || "newest";

    const results = await Promise.allSettled([
      getProductsWithFilters(filters, sort, limit, offset),
      getUniqueBrands(),
      getAvailableSizes(),
      getPriceRange(),
    ]);

    if (results[0].status === "fulfilled") {
      products = (results[0].value.data || []) as Product[];
      totalCount = results[0].value.count || 0;
      totalPages = Math.max(1, Math.ceil(totalCount / limit));
    }

    if (results[1].status === "fulfilled") {
      brands = results[1].value || [];
    }

    if (results[2].status === "fulfilled") {
      sizes = results[2].value || [];
    }

    if (results[3].status === "fulfilled") {
      priceRange = results[3].value || { min: 0, max: 1000000 };
    }
  } catch (error) {
    notFound();
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <Breadcrumb
        items={[
          { label: "Нүүр", href: "/" },
          { label: "Ангилал", href: "/categories" },
          { label: categoryName },
        ]}
      />
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {categoryName}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <ProductFilters
              brands={brands}
              availableSizes={sizes}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
            />
            <ProductSort />
          </div>
          {products.length > 0 ? (
            <>
              <ProductSection products={products} />
              {totalPages > 1 && (
                <PaginationClient 
                  currentPage={Math.min(currentPage, totalPages)} 
                  totalPages={totalPages} 
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={
                <svg
                  className="w-24 h-24 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              }
              title="Энэ ангилалд бүтээгдэхүүн байхгүй"
              description="Одоогоор энэ ангилалд бүтээгдэхүүн байхгүй байна. Бусад ангилалуудыг үзэх боломжтой"
              action={{
                label: "Бүх ангилал",
                href: "/categories",
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
