"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { useModal } from "@/hooks/useModal";

type OrderStatus = "all" | "pending" | "confirmed" | "delivered" | "cancelled";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  earned_xp: number;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  size: number | null;
  price_at_purchase: number;
  products?: {
    name_mn: string;
    name_en: string;
    brand: string;
  };
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const supabase = createClient();
  const modal = useModal();
  const { t } = useLanguage();

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            products (
              name_mn,
              name_en,
              brand
            )
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (activeStatus !== "all") {
        query = query.eq("status", activeStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user, activeStatus, supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    modal.showConfirm(
      "Захиалга цуцлах",
      "Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?",
      async () => {
        setCancellingOrderId(orderId);
        try {
          const response = await fetch(`/api/orders/${orderId}/cancel`, {
            method: "POST",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to cancel order");
          }

          modal.showSuccess("Амжилттай", "Захиалга амжилттай цуцлагдлаа");

          // Refresh orders
          await fetchOrders();
        } catch (error) {
          modal.showError(
            "Алдаа",
            error instanceof Error
              ? error.message
              : "Захиалга цуцлахад алдаа гарлаа",
          );
        } finally {
          setCancellingOrderId(null);
        }
      },
      "Цуцлах",
      "Болих",
    );
  };

  const statusFilters: { id: OrderStatus; labelKey: string }[] = [
    { id: "all", labelKey: "orders.filterAll" },
    { id: "pending", labelKey: "orders.statusPending" },
    { id: "confirmed", labelKey: "orders.statusConfirmed" },
    { id: "delivered", labelKey: "orders.statusDelivered" },
    { id: "cancelled", labelKey: "orders.statusCancelled" },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { icon: string; text: string; labelKey: string }
    > = {
      pending: {
        icon: "🟡",
        text: "text-yellow-700",
        labelKey: "orders.statusPending",
      },
      confirmed: {
        icon: "🔵",
        text: "text-blue-700",
        labelKey: "orders.statusConfirmed",
      },
      delivered: {
        icon: "🟢",
        text: "text-green-700",
        labelKey: "orders.statusDelivered",
      },
      cancelled: {
        icon: "🔴",
        text: "text-red-700",
        labelKey: "orders.statusCancelled",
      },
    };

    const style = statusMap[status] || statusMap.pending;
    return (
      <span
        className={`text-xs font-medium ${style.text} flex items-center gap-1`}
      >
        <span>{style.icon}</span>
        <span>{t(style.labelKey)}</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price) + "₮";
  };

  const canCancelOrder = (status: string) => {
    return status === "pending";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Захиалга уншиж байна...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveStatus(filter.id)}
            className={`px-6 py-2 rounded-full font-medium transition text-sm ${
              activeStatus === filter.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t(filter.labelKey)}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-600 text-lg">Захиалга олдсонгүй</p>
          <p className="text-gray-500 text-sm mt-2">
            Та одоогоор захиалга хийгээгүй байна
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Огноо
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Нийт үнэ
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Төлөв
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <span className="text-gray-900 font-medium">
                      {formatPrice(order.total_amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    {canCancelOrder(order.status) ? (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingOrderId === order.id
                          ? "Цуцлаж байна..."
                          : "Цуцлах"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
