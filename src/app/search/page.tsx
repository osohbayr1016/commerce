import MainNav from "@/components/Header/MainNav";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import ProductFilters from "@/components/Products/ProductFilters";
import ProductSort from "@/components/Products/ProductSort";
import SearchAutocomplete from "@/components/Search/SearchAutocomplete";
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

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string;
    brands?: string;
    sizes?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const query = resolvedParams.q?.trim() ?? "";

  const filters = {
    searchQuery: query,
    brands: resolvedParams.brands?.split(",").filter(Boolean),
    sizes: resolvedParams.sizes?.split(",").map(Number).filter(Boolean),
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    inStockOnly: resolvedParams.inStock === "true",
  };

  const sort = (resolvedParams.sort as SortOption) || "newest";

  const [productsResult, brands, sizes, priceRange] = await Promise.all([
    getProductsWithFilters(filters, sort),
    getUniqueBrands(),
    getAvailableSizes(),
    getPriceRange(),
  ]);

  const results: Product[] = (productsResult.data || []) as Product[];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Хайлт
            </h1>
            <p className="mt-2 text-gray-600">
              Бүтээгдэхүүнээ нэрээр нь хайгаарай
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-10">
            <SearchAutocomplete initialQuery={query} />
          </div>

          {query && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <ProductFilters
                brands={brands}
                availableSizes={sizes}
                minPrice={priceRange.min}
                maxPrice={priceRange.max}
              />
              <ProductSort />
            </div>
          )}

          {query && results.length > 0 && (
            <ProductSection products={results} title="Хайлтын үр дүн" />
          )}

          {query && results.length === 0 && (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              title="Илэрц олдсонгүй"
              description={`"${query}" гэсэн хайлтаар бүтээгдэхүүн олдсонгүй. Өөр нэрээр хайж үзнэ үү.`}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
