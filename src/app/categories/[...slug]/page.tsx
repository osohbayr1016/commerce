import { redirect } from "next/navigation";
import ProductSection from "@/components/Products/ProductSection";
import Breadcrumb from "@/components/ProductDetail/Breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import MainNav from "@/components/Header/MainNav";
import Footer from "@/components/Footer/Footer";
import ProductFilters from "@/components/Products/ProductFilters";
import CategoryPageTitle from "../CategoryPageTitle";
import ProductSort from "@/components/Products/ProductSort";
import PaginationClient from "@/components/ui/PaginationClient";
import {
  getProductsWithFilters,
  getUniqueBrands,
  getUniqueColors,
  getAvailableSizes,
  getPriceRange,
  type SortOption,
} from "@/lib/products";
import { getCategoryByPath, getCategoryChildren } from "@/lib/categories";
import { Product } from "@/data/mockProducts";
import { Category } from "@/types";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{
    brands?: string;
    colors?: string;
    sizes?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
    subcategory?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  let category: Category | null = null;
  let products: Product[] = [];
  let totalCount = 0;
  let totalPages = 1;
  let brands: string[] = [];
  let colors: string[] = [];
  let sizes: number[] = [];
  let priceRange = { min: 0, max: 1000000 };
  let currentPage = 1;
  let subcategories: { id: number; slug: string; name: string; name_en?: string; name_mn?: string; name_ru?: string; name_zh?: string; name_it?: string }[] = [];
  let selectedSubcategory: string | undefined;
  let pathSegments: string[] = [];

  try {
    const { slug } = await params;
    pathSegments = Array.isArray(slug) ? slug : slug ? [slug] : [];

    if (pathSegments.length === 0) {
      redirect("/categories");
    }

    category = await getCategoryByPath(pathSegments);

    if (!category || !category.id) {
      redirect("/products");
    }

    const paramsData = searchParams ? await searchParams : {};
    selectedSubcategory = paramsData?.subcategory;
    currentPage = Math.max(1, parseInt(paramsData?.page || "1") || 1);
    const limit = 24;
    const offset = (currentPage - 1) * limit;

    let filterCategoryId = category.id;
    if (pathSegments.length === 1 && selectedSubcategory) {
      const subCat = await getCategoryByPath([
        ...pathSegments,
        selectedSubcategory,
      ]);
      if (subCat?.id) filterCategoryId = subCat.id;
    }

    const filters = {
      categoryId: filterCategoryId,
      brands: paramsData?.brands?.split(",").filter(Boolean) || [],
      colors: paramsData?.colors?.split(",").filter(Boolean) || [],
      sizes:
        paramsData?.sizes
          ?.split(",")
          .map(Number)
          .filter((n) => !isNaN(n) && n > 0) || [],
      minPrice: paramsData?.minPrice ? Number(paramsData.minPrice) : undefined,
      maxPrice: paramsData?.maxPrice ? Number(paramsData.maxPrice) : undefined,
      inStockOnly: paramsData?.inStock === "true",
    };

    if (filters.minPrice !== undefined && isNaN(filters.minPrice))
      filters.minPrice = undefined;
    if (filters.maxPrice !== undefined && isNaN(filters.maxPrice))
      filters.maxPrice = undefined;

    const sort = (paramsData?.sort as SortOption) || "newest";

    const childrenPromise =
      pathSegments.length === 1 && !selectedSubcategory
        ? getCategoryChildren(category.id)
        : Promise.resolve([] as Category[]);

    const [childrenResult, results] = await Promise.all([
      childrenPromise,
      Promise.allSettled([
        getProductsWithFilters(filters, sort, limit, offset),
        getUniqueBrands(),
        getUniqueColors(filterCategoryId),
        getAvailableSizes(),
        getPriceRange(),
      ]),
    ]);

    const children = (childrenResult || []) as Category[];
    if (children.length > 0) {
      subcategories = children.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name_mn || c.name_en || c.name || c.slug,
        name_en: c.name_en,
        name_mn: c.name_mn,
        name_ru: c.name_ru,
        name_zh: c.name_zh,
        name_it: c.name_it,
      }));
    }

    if (results[0]?.status === "fulfilled") {
      const v = results[0].value;
      products = (v?.data || []) as Product[];
      totalCount = v?.count || 0;
      totalPages = Math.max(1, Math.ceil(totalCount / limit));
    }
    if (results[1]?.status === "fulfilled") brands = results[1].value || [];
    if (results[2]?.status === "fulfilled") colors = results[2].value || [];
    if (results[3]?.status === "fulfilled") sizes = results[3].value || [];
    if (results[4]?.status === "fulfilled")
      priceRange = results[4].value || { min: 0, max: 1000000 };
  } catch {
    redirect("/products");
  }

  if (!category) redirect("/products");

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <Breadcrumb
        items={[
          { labelKey: "nav.home", href: "/" },
          { labelKey: "nav.categories", href: "/categories" },
          { category },
        ]}
      />
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryPageTitle category={category} />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <ProductFilters
              brands={brands}
              availableColors={colors}
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              rootSlug={pathSegments.length === 1 ? pathSegments[0] : undefined}
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
              action={{ label: "Бүх ангилал", href: "/categories" }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
