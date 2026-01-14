"use client";

import { useState } from "react";
import { ProductDetail } from "@/data/mockProductDetail";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            {product.nameEn}
          </h1>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-base text-gray-600">{product.nameMn}</p>
            <span className="text-sm text-gray-400">{product.sku}</span>
          </div>
        </div>
        <div
          className="w-20 h-10 rounded border border-gray-200"
          style={{ backgroundColor: product.brandColor }}
        />
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm text-gray-600">Онлайн авах үнэ</span>
            {product.discount > 0 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                -{product.discount}%
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-semibold text-gray-900">
              {formatPrice(product.price)} ₮
            </span>
          </div>
          {product.savings > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Хэмнэлт: {formatPrice(product.savings)} ₮
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Анхны үнэ</p>
          <p className="text-xl md:text-2xl text-gray-400 line-through">
            {formatPrice(product.originalPrice)} ₮
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-base md:text-lg font-medium text-gray-900">
              Гутлын размер: {selectedSize || "Сонгоно уу"}
            </label>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 underline flex items-center gap-1"
            >
              Хэмжээний заавар
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3.5 px-4 border-2 rounded-lg text-base md:text-lg font-medium transition-all ${
                  selectedSize === size
                    ? "border-gray-900 bg-gray-100 text-gray-900 shadow-sm"
                    : "border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {product.hasFinancing && (
        <div className="border-t border-dashed border-gray-300 pt-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <svg
              className="w-6 h-6 text-gray-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-700">
              Та зээлийн нөхцөлөөр энэхүү барааг авах боломжтой. . powered by
              TDB
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
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
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              readOnly
              className="w-16 text-center text-base font-medium text-gray-900 border-x border-gray-300 py-3"
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled={!selectedSize}
            className={`flex-1 py-4 px-6 rounded-lg text-base md:text-lg font-medium transition-colors ${
              selectedSize
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedSize ? "Сагсанд хийх" : "Хэмжээ сонгоно уу"}
          </button>
          <button
            className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            aria-label="Add to wishlist"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
