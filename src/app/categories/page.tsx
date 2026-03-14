import MainNav from "@/components/Header/MainNav";
import Footer from "@/components/Footer/Footer";
import { getCategoryTree } from "@/lib/categories";
import { Category } from "@/types";
import CategoryAccordion from "@/components/Categories/CategoryAccordion";
import CategoryRootGrid from "@/components/Categories/CategoryRootGrid";

export const revalidate = 300;

const fallbackCategories: Category[] = [
  { id: 0, name: "Бүгд", slug: "all", children: [] },
  { id: 1, name: "Америк захиалга", slug: "americ", children: [] },
  { id: 2, name: "Монгол дахь бэлэн бараа", slug: "local", children: [] },
];

export default async function CategoriesPage() {
  let tree: Category[] = [];

  try {
    tree = await getCategoryTree();
  } catch {
    // keep tree empty, use fallback
  }

  const rootCategories: Category[] =
    tree.length > 0 ? tree : fallbackCategories;

  const hasContent = rootCategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 bg-white">
        <section className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="category-card-enter mb-10 text-center md:mb-12">
              <h1 className="font-heading text-3xl font-semibold text-gray-900 md:text-4xl">
                Ангилал
              </h1>
              <p className="mt-2 text-gray-600">
                Танд тохирох ангиллаа сонгоорой
              </p>
            </div>
            {hasContent ? (
              <>
                <div className="md:hidden">
                  <CategoryAccordion categories={rootCategories} />
                </div>
                <div className="hidden md:block">
                  <CategoryRootGrid categories={rootCategories} />
                </div>
              </>
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
