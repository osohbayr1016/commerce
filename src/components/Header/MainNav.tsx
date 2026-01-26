import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";
import SearchButton from "./SearchButton";
import CartIconWithBadge from "./CartIconWithBadge";
import CoinBalance from "./CoinBalance";
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
    // Silent fail
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          {/* Left: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-gray-700">
            <a
              href="/"
              className="hover:text-gray-900 transition-colors py-1 px-2 rounded-md hover:bg-gray-50"
            >
              Нүүр
            </a>
            <a
              href="/categories"
              className="hover:text-gray-900 transition-colors py-1 px-2 rounded-md hover:bg-gray-50"
            >
              Ангилал
            </a>
            <a
              href="/sale"
              className="hover:text-gray-900 transition-colors py-1 px-2 rounded-md hover:bg-gray-50"
            >
              Хямдрал
            </a>
            <a
              href="/profile?tab=spin"
              className="hover:text-gray-900 transition-colors py-1 px-2 rounded-md hover:bg-gray-50 flex items-center gap-1"
            >
              🎰 Spin
            </a>
            <a
              href="/profile"
              className="hover:text-gray-900 transition-colors py-1 px-2 rounded-md hover:bg-gray-50"
            >
              Профайл
            </a>
          </nav>

          {/* Center: Logo */}
          <div className="flex-1 lg:flex-initial flex justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <a
              href="/"
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              {siteName}
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            <div className="hidden md:block">
              <SearchButton />
            </div>
            <div className="hidden sm:block">
              <CoinBalance />
            </div>
            <CartIconWithBadge />
            <UserMenu />
          </div>
        </div>

        {/* Category Pills Row - Hidden on small mobile, visible on tablet+ */}
        <div 
          className="hidden sm:flex items-center gap-2 md:gap-3 pb-2.5 md:pb-3 overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <span className="text-xs md:text-sm text-gray-500 font-medium whitespace-nowrap shrink-0">
            Ангилал:
          </span>
          <div className="flex items-center gap-2 md:gap-2.5">
            {headerCategories.length > 0 ? (
              headerCategories.map((category) => {
                const displayName =
                  category.name_mn || category.name_en || category.name;
                return (
                  <a
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="px-2.5 md:px-3 py-1 text-xs md:text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:shadow-sm transition-all whitespace-nowrap"
                  >
                    {displayName}
                  </a>
                );
              })
            ) : (
              <>
                <a
                  href="/categories"
                  className="px-2.5 md:px-3 py-1 text-xs md:text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:shadow-sm transition-all whitespace-nowrap"
                >
                  Бүгд
                </a>
                <a
                  href="/categories/us-order"
                  className="px-2.5 md:px-3 py-1 text-xs md:text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:shadow-sm transition-all whitespace-nowrap"
                >
                  Америк захиалга
                </a>
                <a
                  href="/categories/local-stock"
                  className="px-2.5 md:px-3 py-1 text-xs md:text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:shadow-sm transition-all whitespace-nowrap"
                >
                  Монгол дахь бэлэн бараа
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
