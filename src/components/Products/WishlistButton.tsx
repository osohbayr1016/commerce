"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastContainer";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (user && productId) {
      checkWishlist();
    }
  }, [user, productId]);

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();
      setIsInWishlist(!!data);
    } catch {
      setIsInWishlist(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Эхлээд нэвтэрнэ үү", "info");
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
        setIsInWishlist(false);
        showToast("Хадгалсан бүтээгдэхүүнээс хасав", "success");
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;
        setIsInWishlist(true);
        showToast("Хадгалсан бүтээгдэхүүнд нэмэгдлээ", "success");
      }
    } catch (error) {
      showToast("Алдаа гарлаа", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`${className} transition-colors ${
        isInWishlist
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={isInWishlist ? "Хадгалсан бүтээгдэхүүнээс хасах" : "Хадгалсан бүтээгдэхүүнд нэмэх"}
    >
      <svg
        className="w-5 h-5"
        fill={isInWishlist ? "currentColor" : "none"}
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
  );
}
