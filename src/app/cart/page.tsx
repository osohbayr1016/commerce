"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainNavClient from "@/components/Header/MainNavClient";
import Footer from "@/components/Footer/Footer";
import CartItemRow from "@/components/Cart/CartItemRow";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/cart");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNavClient />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Сагс
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Бүгдийг устгах
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">Сагс хоосон байна</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}

              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Нийт дүн</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPrice(subtotal)} ₮
                  </p>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="rounded-full bg-gray-900 px-6 py-3 text-white text-base font-medium hover:bg-gray-800"
                >
                  Захиалга хийх
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
