"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  products: Product;
}

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchWishlist = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          *,
          products (*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      fetchWishlist();
    } catch (error) {
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price) + "₮";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Хадгалсан бүтээгдэхүүн уншиж байна...</p>
      </div>
    );
  }

  return (
    <div>
      {wishlist.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          title="Хадгалсан бүтээгдэхүүн байхгүй"
          description="Таалагдсан бүтээгдэхүүнүүдээ хадгалсан бүтээгдэхүүнд нэмээд хадгална уу"
          action={{
            label: "Дэлгүүр хэсэх",
            onClick: () => window.location.href = "/",
          }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                {item.products.images && item.products.images.length > 0 ? (
                  <img
                    src={item.products.images[0]}
                    alt={item.products.name_mn || item.products.name_en || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 h-10">
                  {item.products.name_mn || item.products.name_en}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {item.products.brand || "Price"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    {item.products.price
                      ? formatPrice(item.products.price)
                      : "-"}
                  </span>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
