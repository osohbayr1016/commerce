"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/data/mockProducts";
import { generateSlug } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import ProductCardImage from "./ProductCardImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedNameFromProduct } from "@/lib/localize";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [stock, setStock] = useState<number | null>(product.stock ?? null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { t, language } = useLanguage();

  const slug = product.id
    ? generateSlug(`${product.brand} ${product.nameEn}`, product.id)
    : "";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("mn-MN").format(price);

  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock < 5;
  const displayName = getLocalizedNameFromProduct(product, language, "Product");

  return (
    <>
      <div
        className={`group flex flex-col h-full relative bg-white ${
          isOutOfStock ? "opacity-75" : ""
        }`}
      >
        {product.id && (
          <div className="absolute top-2 right-2 z-20 shrink-0">
            <WishlistButton productId={String(product.id)} />
          </div>
        )}
        
        {/* Image Area with Quick View Overlay */}
        <div className="relative mb-5 group/image block overflow-hidden bg-[#fafafa]">
          <Link href={`/products/${slug}`} className="block relative">
            <ProductCardImage
              images={product.images}
              alt={displayName}
              imageColor={product.imageColor}
            />
            {isOutOfStock ? (
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium z-10">
                {t("products.outOfStock")}
              </span>
            ) : isLowStock ? (
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium z-10">
                {t("products.lowStock", { count: stock })}
              </span>
            ) : product.discount && product.discount > 0 ? (
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-medium z-10">
                {t("products.discount", { percent: product.discount })}
              </span>
            ) : null}
          </Link>

          {/* Add to Cart Button overlay (Desktop) */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover/image:translate-y-0 transition-transform duration-300 z-20 hidden md:block">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsQuickViewOpen(true);
              }}
              className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-[0.1em] font-medium hover:bg-gray-800 transition-colors"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Text Details */}
        <Link href={`/products/${slug}`} className="flex-1 min-w-0 text-center flex flex-col items-center">
          <h3 className="text-sm font-bold text-black uppercase tracking-[0.1em] mb-1.5">
            {product.brand}
          </h3>
          <p className="text-[13px] text-gray-500 mb-2.5 font-medium">
            {displayName}
          </p>
          <div className="flex flex-col items-center justify-center gap-1">
            <span
              className={`text-[15px] font-medium ${
                product.discount ? "text-red-600" : "text-black"
              }`}
            >
              {formatPrice(product.price)} ₮
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[14px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)} ₮
              </span>
            )}
          </div>
        </Link>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
