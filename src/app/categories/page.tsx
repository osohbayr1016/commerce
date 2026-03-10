import MainNav from "@/components/Header/MainNav";
import Footer from "@/components/Footer/Footer";
import { getCategoryTree } from "@/lib/categories";
import { Category } from "@/types";
import CategoryAccordion from "@/components/Categories/CategoryAccordion";

export const revalidate = 300;

const fallbackCategories = [
  { name: "Бүгд", slug: "all" },
  { name: "Америк захиалга", slug: "americ" },
  { name: "Монгол дахь бэлэн бараа", slug: "local" },
];

function flattenForDesktop(tree: Category[]): Array<{ id: number; name: string; slug: string }> {
  const result: Array<{ id: number; name: string; slug: string }> = [];
  for (const c of tree) {
    result.push({
      id: c.id,
      name: c.name_mn || c.name_en || c.name || "",
      slug: c.path ?? c.slug,
    });
    for (const child of c.children ?? []) {
      result.push({
        id: child.id,
        name: child.name_mn || child.name_en || child.name || "",
        slug: child.path ?? `${c.slug}/${child.slug}`,
      });
    }
  }
  return result;
}

export default async function CategoriesPage() {
  let tree: Category[] = [];

  try {
    tree = await getCategoryTree();
  } catch {
    // keep tree empty, use fallback
  }

  const desktopItems =
    tree.length > 0
      ? flattenForDesktop(tree)
      : fallbackCategories.map((c, i) => ({
          id: i,
          name: c.name,
          slug: c.slug,
        }));

  const rootCategories: Category[] =
    tree.length > 0
      ? tree
      : fallbackCategories.map((c, i) => ({
          id: i,
          name: c.name,
          slug: c.slug,
          children: [],
        })) as Category[];

  const hasContent = desktopItems.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
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
            {hasContent ? (
              <>
                <div className="md:hidden">
                  <CategoryAccordion categories={rootCategories} />
                </div>
                <div className="hidden md:block">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {desktopItems.map((item) => (
                      <a
                        key={item.id}
                        href={
                          item.slug === "all"
                            ? "/"
                            : `/categories/${item.slug}`
                        }
                        className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 text-gray-700 hover:text-gray-900 hover:border-gray-300"
                      >
                        <span className="text-lg font-medium">{item.name}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    ))}
                  </div>
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
