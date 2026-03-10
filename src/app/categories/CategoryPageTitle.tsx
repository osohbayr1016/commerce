"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedName } from "@/lib/localize";
import { Category } from "@/types";

interface CategoryPageTitleProps {
  category: Category;
}

export default function CategoryPageTitle({ category }: CategoryPageTitleProps) {
  const { language } = useLanguage();
  const name = getLocalizedName(category, language) || category.name || "Ангилал";
  return <h1 className="text-3xl font-bold text-gray-900 mb-6">{name}</h1>;
}
