"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const MAIN_NAV_ITEMS = [
  { slug: "male", labelKey: "nav.male" },
  { slug: "female", labelKey: "nav.female" },
  { slug: "accessory", labelKey: "nav.accessory" },
  { slug: "perfume", labelKey: "nav.perfume" },
] as const;

export default function MobileMenu() {
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

  const { t } = useLanguage();

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
                {MAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    onClick={() => phase === "open" && setPhase("leaving")}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
