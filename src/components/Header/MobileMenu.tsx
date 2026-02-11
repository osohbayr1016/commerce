"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSpinModal } from "@/contexts/SpinModalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Category } from "@/types";

interface MobileMenuProps {
  categories: Category[];
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<"entering" | "open" | "leaving">("entering");
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPhase("entering");
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("open"));
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const panel = panelRef.current;
    if (!panel) {
      setIsOpen(false);
      return;
    }
    const onEnd = () => {
      setIsOpen(false);
      setPhase("entering");
    };
    panel.addEventListener("transitionend", onEnd, { once: true });
    return () => panel.removeEventListener("transitionend", onEnd);
  }, [phase]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (phase === "open") setPhase("leaving");
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && phase === "open") setPhase("leaving");
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, phase]);

  const { openSpinModal } = useSpinModal() ?? {};
  const { t } = useLanguage();

  const navLinks: { href?: string; label: string; spin?: boolean }[] = [
    { href: "/", label: t("nav.home") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/sale", label: t("nav.sale") },
    { label: `🎰 ${t("nav.spin")}`, spin: true },
    { href: "/profile", label: t("nav.profile") },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors duration-200 ease-out"
        aria-label={t("common.openMenu")}
      >
        <svg
          className="w-5 h-5"
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
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => phase === "open" && setPhase("leaving")}
        >
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out"
            style={{
              opacity: phase === "open" ? 1 : 0,
            }}
          />
          <div
            ref={panelRef}
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out"
            style={{
              transform: phase === "open" ? "translateX(0)" : "translateX(100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t("common.menu")}</h2>
              <button
                onClick={() => phase === "open" && setPhase("leaving")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={t("common.close")}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                {navLinks.map((link) =>
                  link.spin ? (
                    <button
                      key="spin"
                      type="button"
                      onClick={() => {
                        openSpinModal?.();
                        if (phase === "open") setPhase("leaving");
                      }}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      onClick={() => phase === "open" && setPhase("leaving")}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              {categories.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t("nav.categories")}
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const displayName =
                        category.name_mn || category.name_en || category.name;
                      return (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          onClick={() => phase === "open" && setPhase("leaving")}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          {displayName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
