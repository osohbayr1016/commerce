import MainNav from "@/components/Header/MainNav";
import HeroBanner from "@/components/Hero/HeroBanner";
import ProductSection from "@/components/Products/ProductSection";
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

export const revalidate = 60;

interface HomeProps {
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

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  
  const page = parseInt(params?.page || "1");
  const limit = 24;
  const offset = (page - 1) * limit;
  
  const filters = {
    brands: params?.brands?.split(",").filter(Boolean),
    sizes: params?.sizes?.split(",").map(Number).filter(Boolean),
    minPrice: params?.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params?.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params?.inStock === "true",
  };

  const sort = (params?.sort as SortOption) || "newest";

  const [productsResult, brands, sizes, priceRange] = await Promise.all([
    getProductsWithFilters(filters, sort, limit, offset),
    getUniqueBrands(),
    getAvailableSizes(),
    getPriceRange(),
  ]);

  const products: Product[] = (productsResult.data || []) as Product[];
  const totalCount = productsResult.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const boots = products.filter((p) => p.category === "boots");
  const bags = products.filter((p) => p.category === "bag");

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <HeroBanner />
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <ProductFilters
              brands={brands}
              availableSizes={sizes}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
            />
            <ProductSort />
          </div>
          {boots.length > 0 && <ProductSection products={boots} />}
          {boots.length > 0 && bags.length > 0 && (
            <div className="border-t border-gray-200 my-8"></div>
          )}
          {bags.length > 0 && <ProductSection products={bags} />}
          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-lg">Бүтээгдэхүүн байхгүй байна</p>
              <p className="text-gray-500 text-sm mt-2">
                Админ самбар руу очиж бүтээгдэхүүн нэмнэ үү
              </p>
            </div>
          )}
          {totalPages > 1 && (
            <PaginationClient currentPage={page} totalPages={totalPages} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
