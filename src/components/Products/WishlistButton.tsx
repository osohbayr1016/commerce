"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/ToastContainer";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  className = "",
}: WishlistButtonProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkWishlist = useCallback(async () => {
    if (!user || !productId) return;
    try {
      const res = await fetch(
        `/api/wishlist?product_id=${encodeURIComponent(productId.trim())}`
      );
      if (res.ok) {
        const data = await res.json();
        setIsInWishlist(!!data.inWishlist);
      } else {
        setIsInWishlist(false);
      }
    } catch {
      setIsInWishlist(false);
    }
  }, [user, productId]);

  useEffect(() => {
    if (user && productId) {
      checkWishlist();
    } else {
      setIsInWishlist(false);
    }
  }, [user, productId, checkWishlist]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Эхлээд нэвтэрнэ үү", "info");
      router.push(
        `/auth/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`,
      );
      return;
    }

    const pid = typeof productId === "string" ? productId.trim() : "";
    if (!pid) {
      showToast("Бүтээгдэхүүн олдсонгүй", "error");
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const res = await fetch(
          `/api/wishlist?product_id=${encodeURIComponent(pid)}`,
          { method: "DELETE" }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          showToast(data.error || "Хасахад алдаа гарлаа", "error");
          return;
        }
        setIsInWishlist(false);
        showToast("Хадгалсан бүтээгдэхүүнээс хасав", "success");
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: pid }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          showToast(
            data.error === "Product not found"
              ? "Бүтээгдэхүүн олдсонгүй"
              : data.error || "Хадгалахад алдаа гарлаа",
            "error"
          );
          return;
        }
        setIsInWishlist(true);
        showToast("Хадгалсан бүтээгдэхүүнд нэмэгдлээ", "success");
      }
    } catch {
      showToast("Хадгалахад алдаа гарлаа. Дахин оролдоно уу.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      className={`${className} transition-colors relative z-10 ${
        isInWishlist
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={
        isInWishlist
          ? "Хадгалсан бүтээгдэхүүнээс хасах"
          : "Хадгалсан бүтээгдэхүүнд нэмэх"
      }
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
