"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getLocalizedName,
  getLocalizedNameFromProduct,
} from "@/lib/localize";
import { Category } from "@/types";
import { ProductDetail } from "@/data/mockProductDetail";

interface BreadcrumbItem {
  label?: string;
  labelKey?: string;
  category?: Category;
  product?: ProductDetail;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t, language } = useLanguage();

  const resolveLabel = (item: BreadcrumbItem): string => {
    if (item.label) return item.label;
    if (item.labelKey) return t(item.labelKey);
    if (item.category)
      return getLocalizedName(item.category, language) || item.category.name || "Ангилал";
    if (item.product)
      return getLocalizedNameFromProduct(item.product, language, "Бүтээгдэхүүн");
    return "";
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm md:text-base">
          {items.map((item, index) => {
            const label = resolveLabel(item);
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
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
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
