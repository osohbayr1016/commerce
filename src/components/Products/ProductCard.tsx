"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/data/mockProducts";
import { generateSlug } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import ProductCardImage from "./ProductCardImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedNameFromProduct } from "@/lib/localize";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [stock, setStock] = useState<number | null>(null);
  const { t, language } = useLanguage();

  const slug = product.id
    ? generateSlug(`${product.brand} ${product.nameEn}`, product.id)
    : "";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("mn-MN").format(price);

  useEffect(() => {
    if (product.id) {
      fetch(`/api/products/${product.id}/stock`)
        .then((res) => (res.ok ? res.json() : { stock: null }))
        .then((data) => {
          if (data && typeof data.stock === "number") setStock(data.stock);
        })
        .catch(() => {});
    }
  }, [product.id]);

  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock < 5;
  const displayName = getLocalizedNameFromProduct(product, language, "Product");

  return (
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
      <Link href={`/products/${slug}`} className="flex flex-col flex-1 min-w-0">
        <div className="relative mb-3">
          <ProductCardImage
            images={product.images}
            alt={displayName}
            imageColor={product.imageColor}
          />
          {isOutOfStock ? (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium">
              {t("products.outOfStock")}
            </span>
          ) : isLowStock ? (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium">
              {t("products.lowStock", { count: stock })}
            </span>
          ) : product.discount && product.discount > 0 ? (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-medium">
              {t("products.discount", { percent: product.discount })}
            </span>
          ) : null}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase text-gray-500 tracking-wide mb-1">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {displayName}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                product.discount ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatPrice(product.price)} ₮
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)} ₮
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
