"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const ITEMS = [
  { href: "/", label: "Нүүр", ariaLabel: "home" },
  { href: "/categories", label: "Ангилал", ariaLabel: "categories" },
  { href: "/sale", label: "Хямдрал", ariaLabel: "sale" },
  { href: "/cart", label: "Сагс", ariaLabel: "cart" },
  { href: "/profile", label: "Профайл", ariaLabel: "profile" },
] as const;

function getActiveIndex(pathname: string): number {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/categories")) return 1;
  if (pathname.startsWith("/sale")) return 2;
  if (pathname.startsWith("/cart")) return 3;
  if (pathname.startsWith("/profile")) return 4;
  return 0;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const activeIndex = getActiveIndex(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="relative mx-auto flex max-w-7xl items-center px-4 pb-3 pt-2">
        <div
          className="absolute bottom-2 left-4 right-4 top-2 pointer-events-none md:hidden"
          aria-hidden
        >
          <div
            className="h-full w-[20%] rounded-lg bg-gray-100 transition-[transform] duration-300 ease-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        </div>
        {ITEMS.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative z-10 flex flex-1 flex-col items-center gap-1 text-xs text-gray-600 hover:text-gray-900 aria-[current=page]:text-gray-900 aria-[current=page]:font-medium"
            aria-label={item.ariaLabel}
            aria-current={index === activeIndex ? "page" : undefined}
          >
            {index === 0 && (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"
                />
              </svg>
            )}
            {index === 1 && (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
            {index === 2 && (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h10l3 5-3 5H7L4 12l3-5z"
                />
              </svg>
            )}
            {index === 3 && (
              <>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13l-1.6 8H19M7 13l.4-2M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 right-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-900 px-1.5 text-[10px] font-semibold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </>
            )}
            {index === 4 && (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0H5z"
                />
              </svg>
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
