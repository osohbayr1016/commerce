"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedName } from "@/lib/localize";

interface CategoryRootGridProps {
  categories: Category[];
}

function RootCard({
  category,
  index,
  isExpanded,
  onToggleSubcategories,
}: {
  category: Category;
  index: number;
  isExpanded: boolean;
  onToggleSubcategories: () => void;
}) {
  const { language } = useLanguage();
  const name = getLocalizedName(category, language) || category.name;
  const rootHref = `/categories/${category.path ?? category.slug}`;
  const children = category.children ?? [];
  const hasSubs = children.length > 0;

  return (
    <article
      className="category-card-enter rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <Link
          href={rootHref}
          className="font-heading text-xl font-semibold text-gray-900 transition-colors hover:text-gray-700 md:text-2xl"
        >
          {name}
        </Link>
        {hasSubs ? (
          <button
            type="button"
            onClick={onToggleSubcategories}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide subcategories" : "Show subcategories"}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Link
            href={rootHref}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label={`Go to ${name}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      {hasSubs && (
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-gray-100 px-6 pb-5 pt-3">
              <ul className="grid gap-1 sm:grid-cols-2">
                {children.map((child, i) => {
                  const childName = getLocalizedName(child, language) || child.name;
                  const childHref = `/categories/${child.path ?? `${category.slug}/${child.slug}`}`;
                  return (
                    <li key={child.id}>
                      <Link
                        href={childHref}
                        className="block rounded-lg py-2.5 pr-3 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                      >
                        <span className="font-medium">{childName}</span>
                        <svg
                          className="ml-1 inline h-4 w-4 opacity-60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function CategoryRootGrid({ categories }: CategoryRootGridProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const handleToggle = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat, index) => (
        <RootCard
          key={cat.id}
          category={cat}
          index={index}
          isExpanded={expandedId === cat.id}
          onToggleSubcategories={() => handleToggle(cat.id)}
        />
      ))}
    </div>
  );
}
