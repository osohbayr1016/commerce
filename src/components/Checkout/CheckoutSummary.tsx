"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount?: number;
  total?: number;
}

interface ItemWithImage extends CartItem {
  imageUrl?: string | null;
}

export default function CheckoutSummary({
  items,
  subtotal,
  discount = 0,
  total,
}: CheckoutSummaryProps) {
  const finalTotal = total !== undefined ? total : subtotal;
  const [itemsWithImages, setItemsWithImages] = useState<ItemWithImage[]>(items);

  useEffect(() => {
    const loadImages = async () => {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          let imageUrl: string | null = null;

          if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            const firstImg = item.images[0];
            if (firstImg && typeof firstImg === "string" && firstImg.trim() && !firstImg.match(/^image\d+$/)) {
              imageUrl = firstImg.trim();
            }
          }

          if (!imageUrl && item.id) {
            try {
              const response = await fetch(`/api/products/${item.id}`);
              if (response.ok) {
                const product = await response.json();
                if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
                  const firstImg = product.images[0];
                  if (firstImg && typeof firstImg === "string" && firstImg.trim() && !firstImg.match(/^image\d+$/)) {
                    imageUrl = firstImg.trim();
                  }
                }
              }
            } catch (error) {
            }
          }

          return { ...item, imageUrl };
        })
      );

      setItemsWithImages(updatedItems);
    };

    loadImages();
  }, [items]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Миний сагс
      </h2>
      <div className="space-y-4 mb-6">
        {itemsWithImages.map((item) => {
          return (
          <div key={item.id} className="flex gap-4">
            <div className="w-20 h-20 relative overflow-hidden rounded-lg border border-gray-200">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full bg-gray-100 flex items-center justify-center"
                  style={{ backgroundColor: item.imageColor || "#FAFAFA" }}
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {item.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Тоо ширхэг: {item.quantity}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)} ₮
                </span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Нагш үнэ</span>
          <span className="text-gray-900">{formatPrice(subtotal)} ₮</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Хөнгөлөлт</span>
          <span className="text-gray-900">0 ₮</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Нийт үнэ</span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(subtotal)} ₮
          </span>
        </div>
      </div>
    </div>
  );
}