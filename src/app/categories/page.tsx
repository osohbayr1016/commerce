import MainNav from "@/components/Header/MainNav";
import HeroBanner from "@/components/Hero/HeroBanner";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";

export const revalidate = 300;

const fallbackCategories = [
  { name: "Бүгд", slug: "all" },
  { name: "Америк захиалга", slug: "americ" },
  { name: "Монгол дахь бэлэн бараа", slug: "local" },
];

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, name_en, name_mn")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (data) {
      categories = data as Category[];
    }
  } catch (error) {
  }

  const displayCategories = categories.length
    ? categories.map((category) => ({
        id: category.id,
        name: category.name_mn || category.name_en || category.name,
        slug: category.slug,
      }))
    : fallbackCategories.map((category, index) => ({
        id: `${category.slug}-${index}`,
        name: category.name,
        slug: category.slug,
      }));

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <HeroBanner />
      <main className="flex-1 bg-white">
        <section className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Ангилал
              </h1>
              <p className="mt-2 text-gray-600">
                Танд тохирох ангиллаа сонгоорой
              </p>
            </div>
            {displayCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayCategories.map((category) => (
                  <a
                    key={category.id}
                    href={
                      category.slug === "all"
                        ? "/"
                        : `/categories/${category.slug}`
                    }
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  >
                    <span className="text-lg font-medium">{category.name}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                Ангилал байхгүй байна
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
