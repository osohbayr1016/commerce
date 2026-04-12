"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { useModal } from "@/hooks/useModal";
import OrderHistoryCard from "@/components/Profile/OrderHistoryCard";

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
    id?: string;
    name_mn: string;
    name_en: string;
    brand: string;
    images?: string[];
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
              id,
              name_mn,
              name_en,
              brand,
              images
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

  const getStatusStyle = (status: string) => {
    const statusMap: Record<string, { cls: string; labelKey: string }> = {
      pending: {
        cls: "bg-gray-100 text-gray-600",
        labelKey: "orders.statusPending",
      },
      confirmed: {
        cls: "bg-gray-900 text-white",
        labelKey: "orders.statusConfirmed",
      },
      delivered: {
        cls: "bg-white text-gray-900 border border-gray-200",
        labelKey: "orders.statusDelivered",
      },
      cancelled: {
        cls: "bg-white text-gray-400 border border-gray-200",
        labelKey: "orders.statusCancelled",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const canCancelOrder = (status: string) => {
    return status === "pending";
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b border-gray-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveStatus(filter.id)}
            className={`px-4 py-2 text-xs font-medium tracking-wide uppercase transition-colors duration-200 border-b-2 ${
              activeStatus === filter.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t(filter.labelKey)}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">Захиалга олдсонгүй</p>
          <p className="text-gray-300 text-xs mt-1">
            Та одоогоор захиалга хийгээгүй байна
          </p>
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100">
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <OrderHistoryCard
                key={order.id}
                order={order}
                statusClass={statusStyle.cls}
                statusLabel={t(statusStyle.labelKey)}
                onCancel={handleCancelOrder}
                canCancel={canCancelOrder(order.status)}
                isCancelling={cancellingOrderId === order.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
