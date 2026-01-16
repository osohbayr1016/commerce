import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";
import { Category } from "@/types";

export default async function MainNav() {
  const siteName = "E-Commerce";
  let headerCategories: Category[] = [];

  
  try {
    const supabase = await createClient();

    const { data: categoriesData } = await supabase
      .from("categories")
      .select("id, name, slug, name_en, name_mn")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(6);

    if (categoriesData) {
      headerCategories = categoriesData as Category[];
    }
  } catch (error) {
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="/" className="hover:text-gray-900">
              Нүүр
            </a>
            <a href="/categories" className="hover:text-gray-900">
              Ангилал
            </a>
            <a href="/sale" className="hover:text-gray-900">
              Хямдрал
            </a>
            <a href="/profile" className="hover:text-gray-900">
              Профайл
            </a>
          </nav>

          <div className="flex-1 flex justify-center">
            <a href="/" className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              {siteName}
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="/search"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
              aria-label="search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            <a
              href="/cart"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
              aria-label="cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13l-1.6 8H19M7 13l.4-2M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </a>
            <UserMenu />
          </div>
        </div>

        <div className="pb-4 flex items-center gap-3 overflow-x-auto text-sm">
          <span className="text-gray-500 font-medium whitespace-nowrap">Ангилал</span>
          {headerCategories.length > 0 ? (
            headerCategories.map((category) => {
              const displayName = category.name_mn || category.name_en || category.name;
              return (
                <a
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap"
                >
                  {displayName}
                </a>
              );
            })
          ) : (
            <>
              <a
                href="#"
                className="px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap"
              >
                Бүгд
              </a>
              <a
                href="#"
                className="px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap"
              >
                Америк захиалга
              </a>
              <a
                href="#"
                className="px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap"
              >
                Монгол дахь бэлэн бараа
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
