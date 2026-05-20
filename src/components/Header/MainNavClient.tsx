"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./UserMenu";
import SearchButton from "./SearchButton";
import CartIconWithBadge from "./CartIconWithBadge";
import WishlistIcon from "./WishlistIcon";
import MobileMenu from "./MobileMenu";
import CoinBalance from "./CoinBalance";
import HeaderLanguageDropdown from "./HeaderLanguageDropdown";
import NavItemWithDropdown from "./NavItemWithDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedName } from "@/lib/localize";
import { Category } from "@/types";

const SLUG_TO_KEY: Record<string, string> = {
  male: "nav.male",
  female: "nav.female",
  accessory: "nav.accessory",
  perfume: "nav.perfume",
};

const FALLBACK_NAV = [
  { slug: "male", key: "nav.male" },
  { slug: "female", key: "nav.female" },
  { slug: "accessory", key: "nav.accessory" },
  { slug: "perfume", key: "nav.perfume" },
];

interface MainNavClientProps {
  siteName: string;
  navItems: Category[];
}

export default function MainNavClient({
  siteName,
  navItems,
}: MainNavClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const getLabel = (cat: Category) => {
    const key = SLUG_TO_KEY[cat.slug];
    return key ? t(key) : getLocalizedName(cat, language) || cat.name;
  };

  const useFallback = navItems.length === 0;

  return (
    <header
      className={`sticky top-0 z-50 glass-header border-b transition-all duration-300 ${
        isScrolled ? "border-[#dcc096] shadow-sm" : "border-[#e3ccaa]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div
          className={`relative flex items-center justify-between transition-[height] duration-300 ${
            isScrolled ? "h-14 sm:h-14 lg:h-16" : "h-14 sm:h-16 md:h-18 lg:h-20"
          }`}
        >
          <div
            className={`flex items-center gap-4 shrink-0 z-10 transition-opacity duration-300 ${
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
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled
                    ? "h-10 sm:h-10 md:h-12 lg:h-14"
                    : "h-12 sm:h-16 md:h-20 lg:h-24"
                }`}
                priority
              />
            </a>
            <div className="hidden lg:block">
              <HeaderLanguageDropdown />
            </div>
          </div>

          <nav
            className={`hidden lg:flex items-center gap-8 xl:gap-10 text-[15px] font-medium tracking-wide text-gray-900 font-heading absolute left-1/2 transform transition-all duration-300 ease-out ${
              isSearchOpen
                ? "-translate-x-1/2 opacity-0 pointer-events-none scale-95"
                : "-translate-x-1/2 opacity-100 pointer-events-auto scale-100"
            }`}
            style={{ transitionProperty: "opacity, transform, scale" }}
          >
            {useFallback
              ? FALLBACK_NAV.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    className="luxury-underline hover:text-gray-900 transition-colors whitespace-nowrap"
                  >
                    {t(item.key)}
                  </Link>
                ))
              : navItems.map((cat) => {
                  const children = cat.children || [];
                  if (children.length > 0) {
                    return (
                      <NavItemWithDropdown
                        key={cat.id}
                        category={cat}
                        label={getLabel(cat)}
                        children={children}
                      />
                    );
                  }
                  return (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="luxury-underline hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                      {getLabel(cat)}
                    </Link>
                  );
                })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 z-10 flex-1 md:flex-initial min-w-0 md:min-w-0 justify-end">
            <SearchButton onToggle={setIsSearchOpen} />
            <div
              className={`items-center gap-2 sm:gap-3 lg:gap-4 ${
                isSearchOpen ? "hidden md:flex" : "flex"
              }`}
            >
              <WishlistIcon />
              <CartIconWithBadge />
              <div className="hidden sm:block">
                <CoinBalance />
              </div>
              <UserMenu />
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
