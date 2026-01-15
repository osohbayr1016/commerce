"use client";

import { useMemo } from "react";

export default function MainNavClient() {
  const siteName = "E-Commerce";
  const navLinks = useMemo(
    () => [
      { href: "/", label: "Нүүр" },
      { href: "/categories", label: "Ангилал" },
      { href: "/sale", label: "Хямдрал" },
      { href: "/profile", label: "Профайл" },
    ],
    []
  );

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-gray-900">
                {link.label}
              </a>
            ))}
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
          </div>
        </div>

        <div className="pb-4"></div>
      </div>
    </header>
  );
}
