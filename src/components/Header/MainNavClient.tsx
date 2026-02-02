"use client";

import { useState } from "react";
import Image from "next/image";
import UserMenu from "./UserMenu";
import SearchButton from "./SearchButton";
import CartIconWithBadge from "./CartIconWithBadge";
import WishlistIcon from "./WishlistIcon";
import MobileMenu from "./MobileMenu";
import CoinBalance from "./CoinBalance";
import { Category } from "@/types";

interface MainNavClientProps {
  siteName: string;
  headerCategories: Category[];
}

export default function MainNavClient({
  siteName,
  headerCategories,
}: MainNavClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Main Navigation Bar */}
        <div className="relative flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          {/* Left: Logo */}
          <div
            className={`flex items-center z-10 transition-opacity duration-300 ${
              isSearchOpen ? "opacity-70" : "opacity-100"
            }`}
          >
            <a
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/Screenshot_2026-01-28_at_19.21.32-removebg-preview.png"
                alt={siteName}
                width={300}
                height={100}
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
                priority
              />
            </a>
          </div>

          {/* Center: Desktop Navigation */}
          <nav
            className={`hidden lg:flex items-center gap-7 xl:gap-8 text-lg font-semibold text-gray-900 absolute left-1/2 transform transition-all duration-300 ease-out ${
              isSearchOpen
                ? "-translate-x-1/2 opacity-0 pointer-events-none scale-95"
                : "-translate-x-1/2 opacity-100 pointer-events-auto scale-100"
            }`}
            style={{
              transitionProperty: "opacity, transform, scale",
            }}
          >
            <a
              href="/"
              className="hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Нүүр
            </a>
            <a
              href="/categories"
              className="hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Ангилал
            </a>
            <a
              href="/sale"
              className="hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Хямдрал
            </a>
            <a
              href="/profile?tab=spin"
              className="hover:text-gray-600 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              🎰 Spin
            </a>
            <a
              href="/profile"
              className="hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Профайл
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 z-10">
            <SearchButton onToggle={setIsSearchOpen} />
            <WishlistIcon />
            <CartIconWithBadge />
            <div className="hidden sm:block">
              <CoinBalance />
            </div>
            <UserMenu />
            <MobileMenu categories={headerCategories} />
          </div>
        </div>

        {/* Category Pills Row - Hidden on small mobile, visible on tablet+ */}
        <div
          className="hidden sm:flex items-center gap-2 md:gap-3 pb-2.5 md:pb-3 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <span className="text-xs md:text-sm text-gray-500 font-medium whitespace-nowrap shrink-0">
            Ангилал:
          </span>
          <div className="flex items-center gap-2 md:gap-2.5">
            {headerCategories?.length > 0 ? (
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
