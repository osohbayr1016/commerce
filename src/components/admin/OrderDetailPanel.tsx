"use client";

import Image from "next/image";
import { useState } from "react";

interface OrderItem {
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
}

interface OrderDetail {
  id: string;
  total_amount: number;
  status: string;
  payment_method?: string | null;
  payment_status?: string | null;
  earned_xp?: number;
  created_at: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  zip?: string | null;
  note?: string | null;
  order_items?: OrderItem[];
}

interface Props {
  order: OrderDetail | null;
  onStatusChange?: (id: string, status: any) => Promise<void> | void;
  isUpdating?: boolean;
}

const STATUS_MN: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

export default function OrderDetailPanel({ order, onStatusChange, isUpdating = false }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatMoney = (n: number) => `${new Intl.NumberFormat("mn-MN").format(n || 0)} ₮`;

  const triggerCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. Loading Skeleton Screen
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full flex-1">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-5 shadow-sm">
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-gray-800">Захиалга сонгогдоогүй байна</h3>
        <p className="text-sm text-gray-500 max-w-[320px] mt-2 leading-relaxed">
          Зүүн талын жагсаалтаас захиалга сонгон дэлгэрэнгүй хаяг, захиалсан бараа болон хэрэглэгчийн мэдээллийг харна уу.
        </p>
      </div>
    );
  }

  const itemCount = (order.order_items || []).reduce((s, i) => s + (i.quantity || 0), 0);
  const fullAddress = [order.city, order.district, order.address, order.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div id="printable-invoice" className="relative bg-white flex flex-col h-full text-gray-900 overflow-visible">
      {/* Print styles injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0px !important;
            margin: 0px !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Custom page margins */
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}} />

      {/* 2. PRINT-ONLY HEADER BLOCK (Hidden on screen, shown on print layout) */}
      <div className="hidden print:block mb-8 border-b-2 border-gray-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-950">MAAYAAUVUU SHOP</h1>
            <p className="text-xs text-gray-500">Захиалгын Хуудас / Нэхэмжлэх</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">Огноо: {new Date(order.created_at).toLocaleDateString("mn-MN")}</p>
            <p className="text-xs text-gray-500">Захиалгын ID: #{order.id}</p>
          </div>
        </div>
      </div>

      {/* 3. Screen Header bar */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0 bg-white sticky top-0 z-10 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-gray-900">Захиалга #{order.id.slice(0, 8)}</h2>
            <button
              onClick={() => triggerCopy(order.id, "id")}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Бүтэн ID хуулах"
            >
              {copiedField === "id" ? (
                <span className="text-[10px] text-emerald-600 font-bold">Хуулагдсан!</span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {new Date(order.created_at).toLocaleString("mn-MN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Print Invoice Button */}
          <button
            onClick={handlePrint}
            className="p-2 text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-xl border border-gray-200 hover:border-indigo-100 transition-all duration-200 cursor-pointer flex items-center gap-2 text-xs font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Баримт хэвлэх
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
        {/* 4. Interactive Quick Status Transition Bar */}
        {onStatusChange && (
          <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Удирдах:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                order.status === "pending" ? "bg-amber-100 text-amber-800" :
                order.status === "confirmed" ? "bg-indigo-100 text-indigo-800" :
                order.status === "delivered" ? "bg-emerald-100 text-emerald-800" :
                "bg-gray-100 text-gray-600"
              }`}>
                {STATUS_MN[order.status] || order.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {order.status === "pending" && (
                <>
                  <button
                    onClick={() => onStatusChange(order.id, "confirmed")}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Баталгаажуулах
                  </button>
                  <button
                    onClick={() => onStatusChange(order.id, "cancelled")}
                    disabled={isUpdating}
                    className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 disabled:opacity-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Цуцлах
                  </button>
                </>
              )}

              {order.status === "confirmed" && (
                <>
                  <button
                    onClick={() => onStatusChange(order.id, "delivered")}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Хүргэгдсэн гэж тэмдэглэх
                  </button>
                  <button
                    onClick={() => onStatusChange(order.id, "cancelled")}
                    disabled={isUpdating}
                    className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Цуцлах
                  </button>
                </>
              )}

              {(order.status === "delivered" || order.status === "cancelled") && (
                <button
                  onClick={() => onStatusChange(order.id, "pending")}
                  disabled={isUpdating}
                  className="px-3.5 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 disabled:opacity-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Шинэ захиалга болгох (буцаах)
                </button>
              )}
            </div>
          </div>
        )}

        {/* 5. Custom Status Visual Timeline Progress */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3.5 print:hidden">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Процессын Явц</h3>
          <div className="relative flex items-center justify-between w-full max-w-lg mx-auto pt-3">
            {/* Horizontal Line background */}
            <div className="absolute left-4 right-4 top-[18px] h-0.5 bg-gray-100 z-0"></div>
            {/* Active connecting line fill */}
            <div
              className="absolute left-4 top-[18px] h-0.5 bg-indigo-600 z-0 transition-all duration-500"
              style={{
                width:
                  order.status === "cancelled"
                    ? "0%"
                    : order.status === "delivered"
                      ? "100%"
                      : order.status === "confirmed"
                        ? "50%"
                        : "0%",
              }}
            ></div>

            {/* Step 1: Received */}
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-50 shadow-sm">
                ✓
              </div>
              <span className="text-xs font-bold text-gray-800 mt-2">Хүлээн авсан</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Үүссэн</span>
            </div>

            {/* Step 2: Confirmed */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                order.status === "confirmed" || order.status === "delivered"
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-50"
                  : "bg-white border-2 border-gray-200 text-gray-400"
              }`}>
                {order.status === "confirmed" || order.status === "delivered" ? "✓" : "2"}
              </div>
              <span className={`text-xs font-bold mt-2 ${
                order.status === "confirmed" || order.status === "delivered" ? "text-gray-800" : "text-gray-400"
              }`}>
                Баталгаажсан
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">Бэлтгэгдсэн</span>
            </div>

            {/* Step 3: Delivered */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                order.status === "delivered"
                  ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                  : "bg-white border-2 border-gray-200 text-gray-400"
              }`}>
                {order.status === "delivered" ? "✓" : "3"}
              </div>
              <span className={`text-xs font-bold mt-2 ${
                order.status === "delivered" ? "text-gray-800" : "text-gray-400"
              }`}>
                Хүргэгдсэн
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">Дууссан</span>
            </div>
          </div>

          {/* Cancelled Alert State */}
          {order.status === "cancelled" && (
            <div className="mt-4 p-3.5 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-3 text-rose-800">
              <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-bold">Энэ захиалгыг цуцалсан байна</p>
                <p className="text-[10px] opacity-90 mt-0.5">Цуцалсан захиалгад хүргэлт, төлбөр тооцоо хийгдэхгүй болохыг анхаарна уу.</p>
              </div>
            </div>
          )}
        </div>

        {/* 6. Customer Profile & Shipping Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Customer Information */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Үйлчлүүлэгч
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Нэр</span>
                  <p className="text-sm font-bold text-gray-900">{order.full_name || "Мэдээлэлгүй"}</p>
                </div>

                {order.phone && (
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">Гар утас</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`tel:${order.phone}`}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer print:text-black"
                      >
                        {order.phone}
                      </a>
                      <button
                        onClick={() => triggerCopy(order.phone || "", "phone")}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer print:hidden"
                      >
                        {copiedField === "phone" ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">Хуулагдсан</span>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {order.email && (
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">И-мэйл</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`mailto:${order.email}`}
                        className="text-xs font-semibold text-gray-600 hover:text-indigo-600 hover:underline truncate block cursor-pointer print:text-black"
                      >
                        {order.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Delivery Address & Map Action */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Хүргэлтийн хаяг
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Хаягийн дэлгэрэнгүй</span>
                  <p className="text-xs font-semibold text-gray-800 leading-relaxed mt-0.5">
                    {fullAddress || "Мэдээлэлгүй"}
                  </p>
                </div>

                {/* Google Maps link block */}
                {fullAddress && (
                  <div className="print:hidden pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${order.city || ""} ${order.district || ""} ${order.address || ""}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border border-gray-200 hover:border-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Газрын зураг дээр харах
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Card: Customer Note */}
        {order.note && (
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 text-amber-900">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.055 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div>
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Тэмдэглэл</span>
              <p className="text-xs font-medium italic text-amber-950 leading-relaxed mt-0.5">
                "{order.note}"
              </p>
            </div>
          </div>
        )}

        {/* 7. Beautiful Products List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Захиалсан бараа ({itemCount} ш)
            </h3>
          </div>

          <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4 space-y-4 divide-y-reverse">
            {(order.order_items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-gray-50/40 rounded-xl px-2 transition-colors duration-150">
                {/* Image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-150 shadow-inner group">
                  {item.products?.images?.[0] ? (
                    <Image
                      src={item.products.images[0]}
                      alt={item.products?.name_mn || item.products?.name_en || "Бараа"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-50 text-[10px] text-gray-400 font-semibold">
                      Зураггүй
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                    {item.products?.brand || "Бусад"}
                  </span>
                  <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                    {item.products?.name_mn || item.products?.name_en || "Нэргүй бараа"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {item.size && (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        Хэмжээ: {item.size}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Тоо: {item.quantity} ш
                    </span>
                  </div>
                </div>

                {/* Calculations */}
                <div className="text-right whitespace-nowrap pl-2 shrink-0">
                  <p className="text-sm font-black text-gray-900">
                    {formatMoney(item.price_at_purchase * item.quantity)}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 mt-1">
                    {formatMoney(item.price_at_purchase)} / ш
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Summary & Payment Breakdown Card */}
        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
              Төлбөр ба Тооцоо
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-xs font-semibold text-gray-500">Төлбөрийн хэлбэр</span>
              <span className="text-xs font-bold text-gray-800 bg-white border border-gray-100 px-2.5 py-1 rounded-lg">
                {order.payment_method || "Тодорхойгүй"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-xs font-semibold text-gray-500">Төлбөрийн төлөв</span>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                order.payment_status === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {order.payment_status === "paid" ? "Төлөгдсөн" : "Хүлээгдэж буй"}
              </span>
            </div>

            {order.earned_xp !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-xs font-semibold text-gray-500">Олгох XP</span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                  ★ +{order.earned_xp || 0} XP
                </span>
              </div>
            )}

            <div className="border-t border-gray-200/80 mt-4 pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">Төлөх нийт дүн</span>
              <span className="text-xl font-black text-indigo-600">
                {formatMoney(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* 9. PRINT-ONLY FOOTER SIGNATURES */}
        <div className="hidden print:block pt-16 mt-16 border-t border-dashed border-gray-300">
          <div className="grid grid-cols-2 gap-12 text-center text-xs text-gray-600">
            <div>
              <div className="border-b border-gray-300 pb-12 w-48 mx-auto"></div>
              <p className="mt-2 font-bold">Хүлээлгэн өгсөн (Бэлтгэсэн админ)</p>
            </div>
            <div>
              <div className="border-b border-gray-300 pb-12 w-48 mx-auto"></div>
              <p className="mt-2 font-bold">Хүлээн авсан (Үйлчлүүлэгч / Хүргэгч)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
