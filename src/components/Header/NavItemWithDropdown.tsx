"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedName } from "@/lib/localize";
interface NavItemWithDropdownProps {
  category: Category;
  label?: string;
  children: Category[];
}

export default function NavItemWithDropdown({
  category,
  label,
  children,
}: NavItemWithDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { language } = useLanguage();

  const displayName =
    label ?? getLocalizedName(category, language) ?? category.name;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 180);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="hover:text-gray-600 transition-colors whitespace-nowrap block py-2 tracking-wide"
      >
        {displayName}
      </Link>
      {children.length > 0 && (
        <div
          className={`absolute left-0 top-full pt-3 transition-all duration-200 ease-out ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-white border border-gray-100 rounded-md shadow-lg py-3 min-w-[220px]">
            {children.map((child) => {
              const childName = getLocalizedName(child, language) || child.name;
              const href = `/categories/${child.path || `${category.slug}/${child.slug}`}`;
              return (
                <Link
                  key={child.id}
                  href={href}
                  className="block px-5 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-colors first:pt-3 last:pb-3"
                >
                  {childName}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
