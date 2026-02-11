"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/data/mockProducts";
import { generateSlug } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import ProductQuickView from "./ProductQuickView";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { closeDrawer } = useCart();
  const [stock, setStock] = useState<number | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price);
  };

  const slug = product.id
    ? generateSlug(`${product.brand} ${product.nameEn}`, product.id)
    : "";

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeDrawer();
    setShowQuickView(true);
  };

  useEffect(() => {
    if (product.id) {
      fetch(`/api/products/${product.id}/stock`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return { stock: null };
        })
        .then((data) => {
          if (data && typeof data.stock === "number") {
            setStock(data.stock);
          }
        })
        .catch(() => {});
    }
  }, [product.id]);

  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock < 5;

  return (
    <div
      className={`group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col h-full relative ${isOutOfStock ? "opacity-75" : ""}`}
    >
      {product.id && (
        <div className="absolute top-4 right-4 z-20 shrink-0">
          <WishlistButton productId={String(product.id)} />
        </div>
      )}
      <a href={`/products/${slug}`} className="flex flex-col flex-1 min-w-0">
        <div className="mb-3 relative">
          <div
            className="w-16 h-8 rounded border border-gray-200 bg-gray-50"
            style={{ backgroundColor: product.brandColor }}
          />
          {isOutOfStock && (
            <span className="absolute top-0 right-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
              Бэлэн бараа байхгүй
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="absolute top-0 right-0 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
              {stock} ширхэг үлдсэн
            </span>
          )}
        </div>
        <div
          className="mb-4 relative w-full aspect-square rounded border border-gray-200 overflow-hidden cursor-pointer group/image"
          onClick={handleImageClick}
        >
          {product.images && product.images.length > 0 && product.images[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.nameEn || product.nameMn || "Product"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover/image:bg-black/30"
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/image:opacity-100 pointer-events-none">
                <span className="bg-white/95 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 shadow-lg">
                  Хурдан үзэх
                </span>
              </div>
            </>
          ) : (
            <div
              className="absolute inset-0 bg-gray-50"
              style={{ backgroundColor: product.imageColor }}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 leading-snug ">
            {product.nameEn}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1 ">
            {product.nameMn}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base md:text-lg font-semibold text-gray-900">
              {formatPrice(product.price)} ₮
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)} ₮
            </span>
            {product.discount && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </a>
      <div className="pt-3 mt-auto">
        <AddToCartButton product={product} slug={slug} />
      </div>
      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
}
