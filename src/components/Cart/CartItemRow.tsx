"use client";

import { CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-200 rounded-lg p-4">
      <div
        className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50"
        style={{ backgroundColor: item.imageColor || "#FAFAFA" }}
      />
      <div className="flex-1">
        <a href={`/products/${item.slug}`} className="text-gray-900 font-medium">
          {item.name}
        </a>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(item.price)} ₮
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400"
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <button
          onClick={onIncrease}
          className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Дүн</p>
        <p className="text-base font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)} ₮
        </p>
        <button
          onClick={onRemove}
          className="mt-2 text-xs text-gray-500 hover:text-gray-900"
        >
          Устгах
        </button>
      </div>
    </div>
  );
}
