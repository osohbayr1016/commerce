"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

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
        `
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

  const statusFilters = [
    { id: "all" as OrderStatus, label: "Бүгд" },
    { id: "pending" as OrderStatus, label: "Төлбөр хүлээгдэж буй" },
    { id: "confirmed" as OrderStatus, label: "Баталгаажсан" },
    { id: "delivered" as OrderStatus, label: "Хүргэгдсэн" },
    { id: "cancelled" as OrderStatus, label: "Цуцалсан" },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { icon: string; text: string; label: string }
    > = {
      pending: {
        icon: "🟡",
        text: "text-yellow-700",
        label: "Хүлээгдэж буй",
      },
      confirmed: {
        icon: "🟢",
        text: "text-green-700",
        label: "Баталгаажсан",
      },
      delivered: {
        icon: "🟢",
        text: "text-green-700",
        label: "Хүргэгдсэн",
      },
      cancelled: {
        icon: "🔴",
        text: "text-red-700",
        label: "Цуцалсан",
      },
    };

    const style = statusMap[status] || statusMap.pending;
    return (
      <span className={`text-xs font-medium ${style.text} flex items-center gap-1`}>
        <span>{style.icon}</span>
        <span>{style.label}</span>
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
      {/* Status Filters */}
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
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
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
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Файлын үнэ
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Itemsы
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
                    {order.id.slice(0, 5)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-gray-900 font-medium">
                        {formatPrice(order.total_amount)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                    {order.order_items?.length || 0}
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
