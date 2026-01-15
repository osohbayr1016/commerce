"use client";

import { useRouter, usePathname } from "next/navigation";
import { Product } from "@/data/mockProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: Product;
  slug: string;
}

export default function AddToCartButton({ product, slug }: AddToCartButtonProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleAdd = () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!product.id) {
      return;
    }
    addItem({
      id: String(product.id || ""),
      name: product.nameEn,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      slug,
      brand: product.brand,
      imageColor: product.imageColor,
      brandColor: product.brandColor,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full rounded-full border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-gray-300 hover:text-gray-900"
    >
      Сагслах
    </button>
  );
}
