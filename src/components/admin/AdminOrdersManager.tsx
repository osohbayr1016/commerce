"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetailPanel from "@/components/admin/OrderDetailPanel";

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

interface OrderRow {
  id: string;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  item_count: number;
  payment_status?: string | null;
  payment_method?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
}

interface OrderDetail extends OrderRow {
  payment_method?: string | null;
  payment_status?: string | null;
  earned_xp?: number;
  full_name?: string | null;
  zip?: string | null;
  note?: string | null;
  order_items?: Array<{
    id: string;
    quantity: number;
    size: number | null;
    price_at_purchase: number;
    products?: {
      id?: string;
      name_mn?: string;
      name_en?: string;
      brand?: string;
      images?: string[];
    };
  }>;
}

export default function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Захиалга дуудахад алдаа гарлаа");
        setOrders([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const fetchedOrders = data.orders || [];
      setOrders(fetchedOrders);
      if (!selectedId && fetchedOrders.length > 0) {
        setSelectedId(fetchedOrders[0].id);
      }
    } catch (err) {
      setError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      setDetail(res.ok ? data.order || null : null);
    } catch (err) {
      console.error("Алдаа гарлаа:", err);
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        setDetail((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      } else {
        setError("Захиалгын төлөв шинэчлэхэд алдаа гарлаа");
      }
    } catch (err) {
      setError("Төлөв шинэчлэхэд алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadDetail(selectedId);
    }
  }, [selectedId]);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // CSV Export feature
  const handleExportCSV = () => {
    try {
      const headers = [
        "Захиалгын ID",
        "Үйлчлүүлэгч",
        "Төлбөр (₮)",
        "Төлөв",
        "Төлбөрийн Төлөв",
        "Утас",
        "Э-мэйл",
        "Хаяг",
        "Үүсгэсэн огноо",
      ];
      const rows = filteredOrders.map((order) => [
        order.id,
        `"${order.customer_name.replace(/"/g, '""')}"`,
        order.total_amount,
        STATUS_LABEL[order.status] || order.status,
        order.payment_status === "paid" ? "Төлөгдсөн" : "Төлөгдөөгүй",
        order.phone || "N/A",
        order.email || "N/A",
        `"${[order.city, order.district, order.address].filter(Boolean).join(", ").replace(/"/g, '""')}"`,
        new Date(order.created_at).toLocaleString("mn-MN"),
      ]);

      const csvContent =
        "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  // Compute KPI Statistics
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  // Filter and Sort Logic
  const filteredOrders = orders
    .filter((o) => {
      // Search matches
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        o.customer_name.toLowerCase().includes(searchLower) ||
        o.id.toLowerCase().includes(searchLower) ||
        (o.phone && o.phone.toLowerCase().includes(searchLower)) ||
        (o.email && o.email.toLowerCase().includes(searchLower)) ||
        (o.city && o.city.toLowerCase().includes(searchLower)) ||
        (o.district && o.district.toLowerCase().includes(searchLower));

      // Status filter matches
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;

      // Payment filter matches
      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && o.payment_status === "paid") ||
        (paymentFilter === "pending" && o.payment_status !== "paid");

      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "amount_desc") {
        return b.total_amount - a.total_amount;
      }
      if (sortBy === "amount_asc") {
        return a.total_amount - b.total_amount;
      }
      return 0;
    });

  // Unique Color Generator for Initials Avatar
  const getAvatarBg = (name: string) => {
    const colors = [
      "bg-emerald-500 text-white",
      "bg-blue-500 text-white",
      "bg-indigo-500 text-white",
      "bg-purple-500 text-white",
      "bg-rose-500 text-white",
      "bg-amber-500 text-white",
      "bg-teal-500 text-white",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium animate-pulse">Захиалгын мэдээллийг ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* 1. Dashboard Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Total Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Нийт захиалга</span>
            <span className="text-3xl font-extrabold text-gray-900">{totalCount}</span>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </motion.div>

        {/* KPI: Pending Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Хүлээгдэж буй</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{pendingCount}</span>
              {pendingCount > 0 && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-12 0 9 9 0 0112 0z" />
            </svg>
          </div>
        </motion.div>

        {/* KPI: Delivered Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Хүргэгдсэн</span>
            <span className="text-3xl font-extrabold text-gray-900">{deliveredCount}</span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        {/* KPI: Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Нийт орлого (идэвхтэй)</span>
            <span className="text-2xl font-extrabold text-emerald-600 whitespace-nowrap">
              {new Intl.NumberFormat("mn-MN").format(totalRevenue)} ₮
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* 2. Control Toolbar: Search, Filters & Sort */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Нэр, утас, хаяг, захиалгын ID-аар хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action buttons (Refresh & Export) */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => loadOrders(true)}
              disabled={refreshing}
              className="p-2.5 text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              title="Шинэчлэх"
            >
              <svg className={`w-5 h-5 ${refreshing ? "animate-spin text-indigo-600" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 19l-2.617-2.617" />
              </svg>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer shadow-sm transition-all duration-200 hover:border-gray-300"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV Экспорт
            </button>
          </div>
        </div>

        {/* Filters pills row */}
        <div className="flex flex-col lg:flex-row gap-4 pt-2 border-t border-gray-100 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Захиалгын төлөв:</span>
            {[
              { id: "all", label: "Бүгд", count: totalCount, activeColor: "bg-indigo-600 text-white" },
              { id: "pending", label: "Хүлээгдэж буй", count: pendingCount, activeColor: "bg-amber-500 text-white" },
              { id: "confirmed", label: "Баталгаажсан", count: confirmedCount, activeColor: "bg-indigo-900 text-white" },
              { id: "delivered", label: "Хүргэгдсэн", count: deliveredCount, activeColor: "bg-emerald-600 text-white" },
              { id: "cancelled", label: "Цуцлагдсан", count: orders.filter((o) => o.status === "cancelled").length, activeColor: "bg-gray-500 text-white" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  statusFilter === tab.id
                    ? tab.activeColor + " shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Payment filter */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Төлбөр:</span>
              <div className="bg-gray-100 p-0.5 rounded-xl border border-gray-100 flex">
                {[
                  { id: "all", label: "Бүгд" },
                  { id: "paid", label: "Төлөгдсөн" },
                  { id: "pending", label: "Төлөгдөөгүй" },
                ].map((pOpt) => (
                  <button
                    key={pOpt.id}
                    onClick={() => setPaymentFilter(pOpt.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      paymentFilter === pOpt.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {pOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Эрэмбэлэх:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none cursor-pointer focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all duration-200"
              >
                <option value="newest">Хамгийн шинэ нь эхэндээ</option>
                <option value="oldest">Хамгийн хуучин нь эхэндээ</option>
                <option value="amount_desc">Үнийн дүн (Өндөрөөс бага)</option>
                <option value="amount_asc">Үнийн дүн (Багаас өндөр)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Workspace: Split-Pane Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Master List Pane (Left: 5 cols on desktop) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/40 px-5 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Захиалгууд ({filteredOrders.length})
            </h2>
            {searchQuery && (
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                Илэрц олдсон
              </span>
            )}
          </div>

          <div className="overflow-y-auto max-h-[700px] divide-y divide-gray-100 p-3 space-y-2">
            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 flex items-start gap-2.5">
                <svg className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold">Алдаа гарлаа</p>
                  <p className="text-xs opacity-90 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3.5">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4h16z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">Захиалга олдсонгүй</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[240px] mx-auto">
                  Та хайлтын үг эсвэл шүүлтүүрүүдээ өөрчлөөд үзнэ үү.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filteredOrders.map((o) => {
                  const isSelected = selectedId === o.id;
                  const isCopied = copiedId === o.id;

                  return (
                    <motion.button
                      layoutId={`order-card-${o.id}`}
                      key={o.id}
                      onClick={() => setSelectedId(o.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 relative overflow-hidden flex flex-col gap-3 group cursor-pointer select-none ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600/30"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50 hover:shadow-sm"
                      }`}
                    >
                      {/* Left accent bar for selected order */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                      )}

                      {/* Card Header: Avatar & Customer info & Date */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Initials avatar */}
                          <div className={`w-10 h-10 rounded-full shrink-0 font-bold text-xs flex items-center justify-center shadow-inner ${getAvatarBg(o.customer_name)}`}>
                            {getInitials(o.customer_name)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-150">
                              {o.customer_name}
                            </h4>
                            {/* Click to copy ID widget */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-mono text-gray-400 truncate">
                                #{o.id.slice(0, 8)}
                              </span>
                              <span
                                onClick={(e) => handleCopyId(e, o.id)}
                                className={`p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0`}
                                title="ID хуулах"
                              >
                                {isCopied ? (
                                  <span className="text-[10px] text-emerald-600 font-sans font-semibold">Хуулагдсан!</span>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                  </svg>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order creation Date */}
                        <div className="text-right shrink-0">
                          <span className="text-xs text-gray-400 font-medium block">
                            {new Date(o.created_at).toLocaleDateString("mn-MN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                            {new Date(o.created_at).toLocaleTimeString("mn-MN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Card Body: Items count & address summary */}
                      {(o.city || o.district) && (
                        <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1 pl-1">
                          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{[o.city, o.district].filter(Boolean).join(", ")}</span>
                        </p>
                      )}

                      {/* Card Footer: Badges & Amount */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100/80 mt-1">
                        {/* Status indicators */}
                        <div className="flex flex-wrap gap-1 items-center">
                          {/* Order Status Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            o.status === "confirmed" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                            o.status === "delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}>
                            {STATUS_LABEL[o.status]}
                          </span>

                          {/* Payment status badge */}
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wide uppercase ${
                            o.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {o.payment_status === "paid" ? "Төлөгдсөн" : "Төлөх"}
                          </span>

                          {/* Items count */}
                          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5 ml-1">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            {o.item_count} ш
                          </span>
                        </div>

                        {/* Amount */}
                        <span className="text-sm font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {new Intl.NumberFormat("mn-MN").format(o.total_amount)} ₮
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Detail Panel Pane (Right: 7 cols on desktop) */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          <OrderDetailPanel order={detail} onStatusChange={updateStatus} isUpdating={saving} />
        </div>
      </div>
    </div>
  );
}
