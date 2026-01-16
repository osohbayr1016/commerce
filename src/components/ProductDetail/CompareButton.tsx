"use client";

import { useRouter } from "next/navigation";
import { useComparison } from "@/contexts/ComparisonContext";
import { ProductDetail } from "@/data/mockProductDetail";
import { Product } from "@/types";

interface CompareButtonProps {
  product: ProductDetail;
}

export default function CompareButton({ product }: CompareButtonProps) {
  const router = useRouter();
  const { addToComparison, isInComparison, comparisonProducts } = useComparison();

  const handleCompare = () => {
    const compareProduct: Product = {
      id: product.id,
      name_en: product.nameEn,
      name_mn: product.nameMn,
      brand: product.brand,
      price: product.price,
      original_price: product.originalPrice,
      discount: product.discount,
      images: product.images,
      description: product.description,
      brand_color: product.brandColor,
      image_color: product.imageColor,
    };

    if (!isInComparison(product.id)) {
      addToComparison(compareProduct);
    }
    
    router.push("/compare");
  };

  const isAlreadyAdded = isInComparison(product.id);

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={handleCompare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-900 hover:bg-gray-50 transition"
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {isAlreadyAdded ? "View Comparison" : "Compare with Other Products"}
      </button>
      {comparisonProducts.length > 0 && (
        <p className="text-xs text-center text-gray-500 mt-2">
          {comparisonProducts.length} product{comparisonProducts.length > 1 ? "s" : ""} in comparison
        </p>
      )}
    </div>
  );
}
