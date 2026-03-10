import MainNav from "@/components/Header/MainNav";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import ProductFilters from "@/components/Products/ProductFilters";
import ProductSort from "@/components/Products/ProductSort";
import PaginationClient from "@/components/ui/PaginationClient";
import EmptyState from "@/components/ui/EmptyState";
import {
  getProductsWithFilters,
  getUniqueBrands,
  getAvailableSizes,
  getPriceRange,
  type SortOption,
} from "@/lib/products";
import { Product } from "@/data/mockProducts";

export const revalidate = 300;

interface ProductsPageProps {
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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = Math.max(1, parseInt(params.page || "1") || 1);
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  const filters = {
    brands: params.brands?.split(",").filter(Boolean),
    sizes: params.sizes?.split(",").map(Number).filter((n) => !isNaN(n) && n > 0),
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params.inStock === "true",
  };

  if (filters.minPrice !== undefined && isNaN(filters.minPrice!))
    filters.minPrice = undefined;
  if (filters.maxPrice !== undefined && isNaN(filters.maxPrice!))
    filters.maxPrice = undefined;

  const sort = (params.sort as SortOption) || "newest";

  const [productsResult, brands, sizes, priceRange] = await Promise.all([
    getProductsWithFilters(filters, sort, limit, offset),
    getUniqueBrands(),
    getAvailableSizes(),
    getPriceRange(),
  ]);

  const products: Product[] = (productsResult.data || []) as Product[];
  const totalCount = productsResult.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Бүх бүтээгдэхүүн
            </h1>
            <p className="mt-2 text-gray-600">
              Манай бүх бүтээгдэхүүнийг үзэх
            </p>
          </div>

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
              <ProductSection products={products} title="" />
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
              title="Бүтээгдэхүүн олдсонгүй"
              description="Одоогоор бүтээгдэхүүн байхгүй байна. Ангилалуудыг үзнэ үү."
              action={{ label: "Ангилал", href: "/categories" }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
