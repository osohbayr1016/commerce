"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function MobileBottomNav() {
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-around px-4 pb-3 pt-2">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          aria-label="home"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
          <span>Нүүр</span>
        </Link>

        <Link
          href="/categories"
          className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          aria-label="categories"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Ангилал</span>
        </Link>

        <Link
          href="/sale"
          className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          aria-label="sale"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10l3 5-3 5H7L4 12l3-5z" />
          </svg>
          <span>Хямдрал</span>
        </Link>

        <Link
          href="/cart"
          className="relative flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          aria-label="cart"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13l-1.6 8H19M7 13l.4-2M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 right-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-900 px-1.5 text-[10px] font-semibold text-white">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
          <span>Сагс</span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          aria-label="profile"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0H5z" />
          </svg>
          <span>Профайл</span>
        </Link>
      </div>
    </nav>
  );
}
