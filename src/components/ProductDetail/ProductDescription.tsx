"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  getLocalizedNameFromProduct,
  getLocalizedDescription,
} from "@/lib/localize";
import { ProductDetail } from "@/data/mockProductDetail";

interface ProductDescriptionProps {
  product: ProductDetail;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const { language } = useLanguage();
  const displayName = getLocalizedNameFromProduct(product, language, "Product");
  const descObj = {
    description_en: product.descriptionEn,
    description_mn: product.descriptionMn,
    description_ru: product.descriptionRu,
    description_zh: product.descriptionZh,
    description_it: product.descriptionIt,
  };
  const description =
    getLocalizedDescription(descObj, language) || product.description || "";

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
        Барааны дэлгэрэнгүй
      </h2>
      <div className="space-y-4 text-base text-gray-700 leading-relaxed">
        <p className="font-medium">{displayName}</p>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
