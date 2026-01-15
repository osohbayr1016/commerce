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
    <div className="border border-gray-200 rounded-lg p-4 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Товчоон</h2>
      <div className="space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)} ₮</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
        <span className="text-gray-600">Нийт</span>
        <span className="text-lg font-semibold text-gray-900">
          {formatPrice(subtotal)} ₮
        </span>
      </div>
    </div>
  );
}
