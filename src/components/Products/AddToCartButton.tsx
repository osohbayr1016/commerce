"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/data/mockProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/ToastContainer";
import CartAnimation from "@/components/ui/CartAnimation";

interface AddToCartButtonProps {
  product: Product;
  slug: string;
}

export default function AddToCartButton({ product, slug }: AddToCartButtonProps) {
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [stock, setStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const fetchStock = async () => {
    if (!product.id) return;
    try {
      const response = await fetch(`/api/products/${product.id}/stock`);
      if (response.ok) {
        const data = await response.json();
        setStock(data.stock);
      }
    } catch (err) {
      
    }
  };

  useEffect(() => {
    if (product.id) {
      fetchStock();
    }
  }, [product.id]);

  const handleAdd = async () => {
    // Removed auth check
    // if (!user) {
    //   router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    //   return;
    // }
    if (!product.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${product.id}/stock`);
      if (!response.ok) {
        throw new Error("Бүтээгдэхүүн олдсонгүй");
      }

      const stockData = await response.json();
      const currentCartQuantity =
        items.find((item) => item.id === product.id)?.quantity || 0;
      const requestedQuantity = currentCartQuantity + 1;

      if (stockData.stock < requestedQuantity) {
        setError(
          stockData.stock === 0
            ? "Бэлэн бараа байхгүй"
            : `Зөвхөн ${stockData.stock} ширхэг үлдсэн`
        );
        setLoading(false);
        return;
      }

      if (!product.id) {
        setError("Бүтээгдэхүүний ID олдсонгүй");
        setLoading(false);
        return;
      }

      const result = await addItem({
        id: String(product.id),
        name: product.nameEn || product.nameMn || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        quantity: 1,
        slug,
        brand: product.brand,
        imageColor: product.imageColor,
        brandColor: product.brandColor,
        images: product.images,
      });

      if (result.ok) {
        await fetchStock();
        setShowAnimation(true);
        showToast(`${product.nameEn || product.nameMn || "Бүтээгдэхүүн"} сагсанд нэмэгдлээ`, "success");
      } else {
        setError(result.error || "Сагслахад алдаа гарлаа");
        showToast(result.error || "Сагслахад алдаа гарлаа", "error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock < 5;

  return (
    <div className="w-full">
      <button
        onClick={handleAdd}
        disabled={isOutOfStock || loading}
        className={`w-full rounded-full border px-3 py-2 text-xs transition-colors ${
          isOutOfStock
            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading
          ? "Түр хүлээнэ үү..."
          : isOutOfStock
          ? "Бэлэн бараа байхгүй"
          : "Сагслах"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-600 text-center">{error}</p>
      )}
      {isLowStock && !error && (
        <p className="mt-1 text-xs text-orange-600 text-center">
          Зөвхөн {stock} ширхэг үлдсэн
        </p>
      )}
      <CartAnimation trigger={showAnimation} onComplete={() => setShowAnimation(false)} />
    </div>
  );
}
