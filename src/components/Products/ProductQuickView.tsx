"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/mockProducts";
import { generateSlug } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { useRouter } from "next/navigation";

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const router = useRouter();
  const [stock, setStock] = useState<number | null>(null);
  const slug = product.id ? generateSlug(`${product.brand} ${product.nameEn}`, product.id) : "";

  useEffect(() => {
    if (product.id) {
      fetch(`/api/products/${product.id}/stock`)
        .then((res) => res.json())
        .then((data) => setStock(data.stock))
        .catch(() => {});
    }
  }, [product.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price);
  };

  const handleViewFull = () => {
    router.push(`/products/${slug}`);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-gray-900">Бүтээгдэхүүний мэдээлэл</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {product.images && product.images.length > 0 && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.nameEn || product.nameMn || ""}
                    className="w-full aspect-square rounded border border-gray-200 object-cover"
                  />
                ) : (
                  <div
                    className="w-full aspect-square rounded border border-gray-200 bg-gray-50"
                    style={{ backgroundColor: product.imageColor }}
                  />
                )}
              </div>

              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {product.nameEn}
                    </h3>
                    <p className="text-gray-600 mb-2">{product.nameMn}</p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  {product.id && <WishlistButton productId={String(product.id)} />}
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)} ₮
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)} ₮
                    </span>
                    {product.discount && (
                      <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  {stock !== null && stock > 0 && stock < 5 && (
                    <p className="text-sm text-orange-600">
                      Зөвхөн {stock} ширхэг үлдсэн
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <AddToCartButton product={product} slug={slug} />
                  <button
                    onClick={handleViewFull}
                    className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Дэлгэрэнгүй үзэх
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
