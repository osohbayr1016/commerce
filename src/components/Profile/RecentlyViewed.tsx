"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import Link from "next/link";

interface ViewedProduct {
  id: string;
  product_id: string;
  viewed_at: string;
  products: Product;
}

export default function RecentlyViewed() {
  const { user } = useAuth();
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchRecentlyViewed = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("product_views")
        .select(
          `
          *,
          products (*)
        `
        )
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      
      const uniqueProducts = data?.filter(
        (item: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.product_id === item.product_id)
      );

      setViewedProducts(uniqueProducts || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchRecentlyViewed();
  }, [fetchRecentlyViewed]);

  const clearHistory = async () => {
    if (!confirm("Үзсэн бүтээгдэхүүний түүхийг устгах уу?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("product_views")
        .delete()
        .eq("user_id", user?.id);

      if (error) throw error;
      setViewedProducts([]);
    } catch (error) {
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Дөнгөж сая";
    if (diffMins < 60) return `${diffMins} минутын өмнө`;
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    if (diffDays < 7) return `${diffDays} өдрийн өмнө`;

    return date.toLocaleDateString("mn-MN", {
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price) + "₮";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Түүх уншиж байна...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Саяхан үзсэн бүтээгдэхүүн
        </h2>
        {viewedProducts.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Түүх цэвэрлэх
          </button>
        )}
      </div>

      {viewedProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="text-gray-600 text-lg">Үзсэн бүтээгдэхүүн байхгүй</p>
          <p className="text-gray-500 text-sm mt-2">
            Үзсэн бүтээгдэхүүн энд харагдах болно
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {viewedProducts.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.product_id}`}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition"
            >
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                {item.products.images && item.products.images.length > 0 ? (
                  <Image
                    src={item.products.images[0]}
                    alt={item.products.name_mn || item.products.name_en || "Product"}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Зураг
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">
                  {item.products.brand}
                </p>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.products.name_mn || item.products.name_en}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-900">
                    {item.products.price
                      ? formatPrice(item.products.price)
                      : "Үнэ тодорхойгүй"}
                  </span>
                  {item.products.discount && item.products.discount > 0 && (
                    <span className="text-sm text-red-600 font-medium">
                      -{item.products.discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Viewed Time */}
              <div className="text-right ">
                <p className="text-xs text-gray-500">
                  {formatDate(item.viewed_at)}
                </p>
                {item.products.stock !== undefined &&
                  item.products.stock > 0 && (
                    <p className="text-xs text-green-600 mt-1">Нөөцтэй</p>
                  )}
                {item.products.stock === 0 && (
                  <p className="text-xs text-red-600 mt-1">Дууссан</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
