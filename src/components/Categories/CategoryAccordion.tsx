"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedName } from "@/lib/localize";

interface CategoryAccordionProps {
  categories: Category[];
}

function AccordionItem({
  category,
  isExpanded,
  onToggle,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { language } = useLanguage();
  const displayName = getLocalizedName(category, language) || category.name;
  const hasChildren = (category.children?.length ?? 0) > 0;

  const rowContent = (
    <>
      <span className="text-lg font-medium">{displayName}</span>
      {hasChildren ? (
        <svg
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-out ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </>
  );

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {hasChildren ? (
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between py-4 text-left text-gray-700 hover:text-gray-900"
        >
          {rowContent}
        </button>
      ) : (
        <Link
          href={category.slug === "all" ? "/" : `/categories/${category.slug}`}
          className="flex w-full items-center justify-between py-4 text-left text-gray-700 hover:text-gray-900"
        >
          {rowContent}
        </Link>
      )}
      {hasChildren && (
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="pb-2 pl-4">
              {(category.children ?? []).map((child) => {
                const childName =
                  getLocalizedName(child, language) || child.name;
                const href = `/categories/${child.path || `${category.slug}/${child.slug}`}`;
                return (
                  <Link
                    key={child.id}
                    href={href}
                    className="block py-2.5 text-gray-600 hover:text-gray-900"
                  >
                    {childName}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
      {categories.map((category) => (
        <AccordionItem
          key={category.id}
          category={category}
          isExpanded={expandedId === category.id}
          onToggle={() =>
            setExpandedId((prev) =>
              prev === category.id ? null : category.id
            )
          }
        />
      ))}
    </div>
  );
}
