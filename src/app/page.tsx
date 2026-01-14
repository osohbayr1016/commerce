import MainNav from "@/components/Header/MainNav";
import PageNav from "@/components/Header/PageNav";
import HeroBanner from "@/components/Hero/HeroBanner";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/data/mockProducts";

export default async function Home() {
  const supabase = await createClient();

  // Fetch all products from Supabase
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Convert database products to Product interface
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

  const boots = products.filter((p) => p.category === "boots");
  const bags = products.filter((p) => p.category === "bag");

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <PageNav />
      <HeroBanner />
      <main className="flex-1 bg-white">
        {boots.length > 0 && <ProductSection products={boots} />}
        {boots.length > 0 && bags.length > 0 && (
          <div className="border-t border-gray-200"></div>
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
      </main>
      <Footer />
    </div>
  );
}
