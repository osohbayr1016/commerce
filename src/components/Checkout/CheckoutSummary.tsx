"use client";

import { CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function CheckoutSummary({
  items,
  subtotal,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Миний сагс
      </h2>

      {/* Product List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            {/* Product Image */}
            <div className="w-20 h-20 flex-shrink-0">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200" />
              )}
            </div>

            {/* Product Info */}
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
        ))}
      </div>

      {/* Summary */}
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
