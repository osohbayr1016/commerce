import MainNav from "@/components/Header/MainNav";
import HeroBanner from "@/components/Hero/HeroBanner";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/data/mockProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SalePage() {
  let dbProducts = null;

  try {
    const supabase = await createClient();
    const result = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    dbProducts = result.data;
  } catch (error) {
    dbProducts = [];
  }

  const products: Product[] = (dbProducts || []).map((p) => ({
    id: p.id,
    brand: p.brand || "",
    nameEn: p.name_en || p.title || "",
    nameMn: p.name_mn || "",
    category: p.subcategory?.toLowerCase().includes("цүнх") ? "bag" : "boots",
    price: p.price || 0,
    originalPrice: p.original_price || p.price || 0,
    discount: p.discount,
    brandColor: p.brand_color || "#F5F5F5",
    imageColor: p.image_color || "#FAFAFA",
  }));

  const discounted = products.filter(
    (p) => (p.discount ?? 0) > 0 || p.originalPrice > p.price
  );

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <HeroBanner />
      <main className="flex-1 bg-white">
        <section className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Хямдрал
            </h1>
            <p className="mt-2 text-gray-600">
              Хямдралтай бүтээгдэхүүнүүдийг эндээс олно уу
            </p>
          </div>
        </section>
        {discounted.length > 0 ? (
          <ProductSection products={discounted} title="Хямдралтай" />
        ) : (
          <div className="py-12 text-center text-gray-600">
            Одоогоор хямдралтай бүтээгдэхүүн байхгүй байна
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
