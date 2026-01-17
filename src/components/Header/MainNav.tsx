import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";
import SearchButton from "./SearchButton";
import CartIconWithBadge from "./CartIconWithBadge";
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
            <div className="hidden sm:block">
              <SearchButton />
            </div>
            <CartIconWithBadge />
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
