"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartItemRow from "@/components/Cart/CartItemRow";
import EmptyState from "@/components/ui/EmptyState";
import BackButton from "@/components/ui/BackButton";
import CartSkeleton from "@/components/ui/skeletons/CartSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartClient() {
  const { user, loading } = useAuth();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Guest access allowed for cart
  }, [loading, user, router]);

  if (loading) {
    return <CartSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Миний сагс
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Бүгдийг устгах
              </button>
            )}
          </div>

          {(items || []).length === 0 ? (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              }
              title="Сагс хоосон байна"
              description="Сагсанд бүтээгдэхүүн нэмээд захиалга өгөх боломжтой"
              action={{
                label: "Дэлгүүр хэсэх",
                onClick: () => router.push("/"),
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Сагсанд{" "}
                  <span className="font-semibold text-gray-900">
                    {(items || []).reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    )}{" "}
                    ширхэг
                  </span>{" "}
                  бүтээгдэхүүн байна
                </p>
              </div>

              {(items || []).map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onRemove={() => removeItem(item.id, item.size)}
                />
              ))}

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Бүтээгдэхүүний тоо:{" "}
                      <span className="font-medium text-gray-900">
                        {(items || []).reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        ширхэг
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Нэгж бүтээгдэхүүн:{" "}
                      <span className="font-medium text-gray-900">
                        {(items || []).length} төрөл
                      </span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500 mb-1">Нийт дүн:</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatPrice(subtotal)} ₮
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full sm:w-auto rounded-lg bg-black px-8 py-3 text-white text-base font-medium hover:bg-gray-800 transition-colors"
                >
                  Захиалга өгөх
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
