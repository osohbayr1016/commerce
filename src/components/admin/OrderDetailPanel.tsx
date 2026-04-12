"use client";
import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  size: number | null;
  price_at_purchase: number;
  products?: { name_mn?: string; name_en?: string; brand?: string; images?: string[] };
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
}

const STATUS_MN: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

export default function OrderDetailPanel({ order }: Props) {
  if (!order) {
    return <div className="text-sm text-gray-500">Захиалга сонгоно уу.</div>;
  }
  const formatMoney = (n: number) => `${new Intl.NumberFormat("mn-MN").format(n || 0)} ₮`;
  const itemCount = (order.order_items || []).reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <div className="space-y-8 bg-white text-gray-900">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold">Захиалга #{order.id.slice(0, 8)}</h2>
          <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString("mn-MN")}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Төлөв</p>
          <p className="font-semibold">{STATUS_MN[order.status] || order.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Хэрэглэгчийн мэдээлэл</h3>
          <div className="rounded-lg bg-gray-50 p-4 space-y-2">
            <p className="text-sm font-medium">{order.full_name || "—"}</p>
            <p className="text-sm text-gray-600">{order.phone || "—"}</p>
            <p className="text-sm text-gray-600">{order.email || "—"}</p>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Хүргэлтийн хаяг</h3>
          <div className="rounded-lg bg-gray-50 p-4 space-y-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              {[order.city, order.district, order.address, order.zip]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
            {order.note && (
              <p className="text-sm text-gray-500 italic mt-2">Тэмдэглэл: {order.note}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
          Бүтээгдэхүүнүүд ({itemCount} ш)
        </h3>
        <div className="divide-y divide-gray-100">
          {(order.order_items || []).map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-200">
                {item.products?.images?.[0] ? (
                  <Image
                    src={item.products.images[0]}
                    alt={item.products?.name_mn || item.products?.name_en || "Бараа"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-gray-400">Зураггүй</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1">{item.products?.brand || "Brand"}</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.products?.name_mn || item.products?.name_en || "Бараа"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Хэмжээ: {item.size || "-"} | Тоо: {item.quantity}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">
                  {formatMoney(item.price_at_purchase * item.quantity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatMoney(item.price_at_purchase)} / ш</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary / Payment */}
      <div className="rounded-lg bg-gray-50 p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Төлбөрийн хэлбэр</span>
          <span className="font-medium text-gray-900">{order.payment_method || "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Төлбөрийн төлөв</span>
          <span className="font-medium text-gray-900">
            {order.payment_status === "paid"
              ? "Төлөгдсөн"
              : order.payment_status === "pending"
                ? "Хүлээгдэж буй"
                : order.payment_status || "-"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Цуглуулсан XP</span>
          <span className="font-medium text-gray-900">+{order.earned_xp || 0} XP</span>
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Нийт дүн</span>
          <span className="text-lg font-bold text-gray-900">{formatMoney(order.total_amount)}</span>
        </div>
      </div>
    </div>
  );
}
