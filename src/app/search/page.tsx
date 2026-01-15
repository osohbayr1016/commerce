import MainNav from "@/components/Header/MainNav";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/data/mockProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchPageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const query = resolvedParams.q?.trim() ?? "";
  let results: Product[] = [];

  if (query) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .or(
          `name_en.ilike.%${query}%,name_mn.ilike.%${query}%,title.ilike.%${query}%,brand.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (data) {
        results = data.map((item: any) => ({
          id: item.id,
          brand: item.brand || "",
          nameEn: item.name_en || item.title || "",
          nameMn: item.name_mn || "",
          category: item.subcategory?.toLowerCase().includes("цүнх")
            ? "bag"
            : "boots",
          price: item.price || 0,
          originalPrice: item.original_price || item.price || 0,
          discount: item.discount,
          brandColor: item.brand_color || "#F5F5F5",
          imageColor: item.image_color || "#FAFAFA",
        }));
      }
    } catch (error) {
      console.log("Search failed:", error);
    }
  }

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

          <form action="/search" className="max-w-xl mx-auto mb-10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Жишээ: MK, цүнх, гутал"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                type="submit"
                className="rounded-full bg-gray-900 px-5 py-2 text-white text-sm md:text-base hover:bg-gray-800"
              >
                Хайх
              </button>
            </div>
          </form>

          {query && results.length > 0 && (
            <ProductSection products={results} title="Хайлтын үр дүн" />
          )}

          {query && results.length === 0 && (
            <p className="text-center text-gray-600">
              Илэрц олдсонгүй
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
