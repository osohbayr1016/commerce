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

export const revalidate = 60;

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
  const { slug } = await params;
  const paramsData = await searchParams;
  let category: Category | null = null;

  try {
    const supabase = await createClient();
    
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (categoryError || !categoryData) {
      notFound();
    }

    category = categoryData as Category;
  } catch (error) {
    notFound();
  }

  if (!category) {
    notFound();
  }

  const page = parseInt(paramsData?.page || "1");
  const limit = 24;
  const offset = (page - 1) * limit;

  const filters = {
    categoryId: category.id,
    brands: paramsData?.brands?.split(",").filter(Boolean),
    sizes: paramsData?.sizes?.split(",").map(Number).filter(Boolean),
    minPrice: paramsData?.minPrice ? Number(paramsData.minPrice) : undefined,
    maxPrice: paramsData?.maxPrice ? Number(paramsData.maxPrice) : undefined,
    inStockOnly: paramsData?.inStock === "true",
  };

  const sort = (paramsData?.sort as SortOption) || "newest";

  const [productsResult, brands, sizes, priceRange] = await Promise.all([
    getProductsWithFilters(filters, sort, limit, offset),
    getUniqueBrands(),
    getAvailableSizes(),
    getPriceRange(),
  ]);

  const products: Product[] = (productsResult.data || []) as Product[];
  const totalCount = productsResult.count || 0;
  const totalPages = Math.ceil(totalCount / limit);
  const categoryName = category.name_mn || category.name_en || category.name;

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
                <PaginationClient currentPage={page} totalPages={totalPages} />
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
                onClick: () => window.location.href = "/categories",
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
