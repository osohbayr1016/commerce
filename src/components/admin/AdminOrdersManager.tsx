"use client";

import { useEffect, useState } from "react";
import OrderDetailPanel from "@/components/admin/OrderDetailPanel";

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};
interface OrderRow { id: string; customer_name: string; total_amount: number; status: OrderStatus; created_at: string; item_count: number; }
interface OrderDetail extends OrderRow {
  payment_method?: string | null; payment_status?: string | null; earned_xp?: number;
  full_name?: string | null; phone?: string | null; email?: string | null;
  address?: string | null; city?: string | null; district?: string | null; zip?: string | null; note?: string | null;
  order_items?: Array<{ id: string; quantity: number; size: number | null; price_at_purchase: number; products?: { name_mn?: string; name_en?: string; brand?: string } }>;
}

export default function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Захиалга дуудахад алдаа гарлаа");
      setOrders([]);
      setLoading(false);
      return;
    }
    setOrders(data.orders || []);
    if (!selectedId && data.orders?.[0]?.id) setSelectedId(data.orders[0].id);
    setLoading(false);
  };

  const loadDetail = async (id: string) => {
    const res = await fetch(`/api/admin/orders/${id}`);
    const data = await res.json();
    setDetail(res.ok ? data.order || null : null);
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setDetail((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    } else {
      setError("Захиалгын төлөв шинэчлэхэд алдаа гарлаа");
    }
    setSaving(false);
  };

  useEffect(() => { loadOrders(); }, []);
  useEffect(() => { if (selectedId) loadDetail(selectedId); }, [selectedId]);

  if (loading) return <div className="p-10 text-center text-gray-500">Захиалга ачааллаж байна...</div>;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 bg-white min-h-screen">
      <div className="lg:col-span-4 border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col max-h-[800px]">
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Бүх захиалга</h2>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedId(o.id)}
              className={`w-full rounded-lg border p-4 text-left transition-colors duration-200 ${
                selectedId === o.id
                  ? "border-gray-900 bg-gray-50 shadow-sm ring-1 ring-gray-900"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{o.customer_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">#{o.id.slice(0, 8)}</p>
                </div>
                <p className="text-xs text-gray-500 shrink-0 mt-0.5">
                  {new Date(o.created_at).toLocaleDateString("mn-MN", { month: "short", day: "numeric" })}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("mn-MN").format(o.total_amount)} ₮
                </p>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                  onClick={(e) => e.stopPropagation()}
                  className={`rounded-md border border-gray-200 px-2 py-1 text-xs font-medium focus:border-gray-900 focus:ring-0 ${
                    o.status === "confirmed" ? "bg-gray-900 text-white border-gray-900" :
                    o.status === "delivered" ? "bg-gray-100 text-gray-900" :
                    o.status === "cancelled" ? "bg-white text-gray-400" :
                    "bg-gray-50 text-gray-600"
                  }`}
                  disabled={saving}
                >
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="confirmed">Баталгаажсан</option>
                  <option value="delivered">Хүргэгдсэн</option>
                  <option value="cancelled">Цуцлагдсан</option>
                </select>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm overflow-auto max-h-[800px]">
        <OrderDetailPanel order={detail} />
      </div>
    </div>
  );
}
