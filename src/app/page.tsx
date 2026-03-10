import Link from "next/link";
import MainNav from "@/components/Header/MainNav";
import HeroCarousel from "@/components/Hero/HeroCarousel";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import {
  getProductsWithFilters,
  type SortOption,
} from "@/lib/products";
import { getHeroBanners } from "@/lib/hero";
import { Product } from "@/data/mockProducts";

export const revalidate = 300;

export default async function Home() {
  const limit = 24;
  const [productsResult, heroBanners] = await Promise.all([
    getProductsWithFilters({}, "newest" as SortOption, limit, 0),
    getHeroBanners(),
  ]);

  const products: Product[] = (productsResult.data || []) as Product[];
  const boots = products.filter((p) => p.category === "boots");
  const bags = products.filter((p) => p.category === "bag");

  const bootsViewAll = boots[0]?.categoryPath
    ? `/categories/${boots[0].categoryPath}`
    : "/categories/female";
  const bagsViewAll = bags[0]?.categoryPath
    ? `/categories/${bags[0].categoryPath}`
    : "/categories/accessory";

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <HeroCarousel initialBanners={heroBanners} />
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {boots.length > 0 && (
            <ProductSection
              products={boots}
              title="Boots"
              viewAllHref={bootsViewAll}
              viewAllLabel="View all"
            />
          )}
          {boots.length > 0 && bags.length > 0 && (
            <div className="border-t border-gray-200 my-8" />
          )}
          {bags.length > 0 && (
            <ProductSection
              products={bags}
              title="Bags"
              viewAllHref={bagsViewAll}
              viewAllLabel="View all"
            />
          )}
          {products.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Бүх бүтээгдэхүүн харах
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-lg">Бүтээгдэхүүн байхгүй байна</p>
              <p className="text-gray-500 text-sm mt-2">
                Админ самбар руу очиж бүтээгдэхүүн нэмнэ үү
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
