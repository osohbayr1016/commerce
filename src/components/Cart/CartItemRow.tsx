"use client";

import Link from "next/link";
import { CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/Checkout/ProductImage";

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
      <Link 
        href={`/products/${item.slug}`}
        className="relative w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
      >
        <ProductImage
          productId={item.id}
          images={item.images}
          imageColor={item.imageColor}
          alt={item.name}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.slug}`} className="text-base font-semibold text-gray-900 hover:text-gray-700 block">
          {item.name}
        </Link>
        {item.brand && (
          <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
        )}
        {item.size && (
          <p className="text-xs text-gray-500 mt-1">
            Хэмжээ: <span className="font-medium">{item.size}</span>
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          {formatPrice(item.price)} ₮ / ширхэг
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">Тоо ширхэг</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrease}
            className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-medium"
            aria-label="Тоо ширхэг багасгах"
          >
            −
          </button>
          <span className="w-10 text-center text-base font-semibold text-gray-900">
            {item.quantity}
          </span>
          <button
            onClick={onIncrease}
            className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-medium"
            aria-label="Тоо ширхэг нэмэх"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          {item.quantity} × {formatPrice(item.price)} ₮
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Нийт дүн</p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(item.price * item.quantity)} ₮
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-xs text-red-600 hover:text-red-800 hover:underline transition-colors"
        >
          Устгах
        </button>
      </div>
    </div>
  );
}
