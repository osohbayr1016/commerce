"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/utils";

interface StickyAddToCartProps {
  productName: string;
  price: number;
  image?: string;
  onAddToCart: () => void;
  disabled?: boolean;
}

export default function StickyAddToCart({
  productName,
  price,
  image,
  onAddToCart,
  disabled
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] px-4 py-3 md:px-6 md:py-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-4 max-w-7xl mx-auto w-full justify-between">
        <div className="hidden md:flex items-center gap-4">
          {image && (
            <img
              src={image}
              alt={productName}
              className="w-12 h-12 object-cover rounded-md"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm line-clamp-1">
              {productName}
            </p>
            <p className="text-gray-500 font-medium text-sm">
              {formatPrice(price)} ₮
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="md:hidden flex-1">
            <p className="font-bold text-gray-900 text-lg">
              {formatPrice(price)} ₮
            </p>
          </div>
          <button
            onClick={onAddToCart}
            disabled={disabled}
            className={`py-3 px-8 rounded-lg font-semibold text-sm transition-colors duration-200 md:min-w-[200px] ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {t("products.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
