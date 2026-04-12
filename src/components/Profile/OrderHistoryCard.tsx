"use client";

import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  size: number | null;
  price_at_purchase: number;
  products?: {
    id?: string;
    brand?: string;
    name_mn?: string;
    name_en?: string;
    images?: string[];
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  earned_xp: number;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderHistoryCardProps {
  order: Order;
  statusLabel: string;
  statusClass: string;
  onCancel: (orderId: string) => void;
  canCancel: boolean;
  isCancelling: boolean;
}

export default function OrderHistoryCard({
  order,
  statusLabel,
  statusClass,
  onCancel,
  canCancel,
  isCancelling,
}: OrderHistoryCardProps) {
  const mainItem = order.order_items?.[0];
  const imageSrc = mainItem?.products?.images?.[0] || "";
  const itemName = mainItem?.products?.name_mn || mainItem?.products?.name_en || "Product";
  const itemBrand = mainItem?.products?.brand || "Brand";
  const moreCount = Math.max((order.order_items?.length || 1) - 1, 0);
  const formattedDate = new Date(order.created_at).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const total = `${new Intl.NumberFormat("mn-MN").format(order.total_amount)}₮`;

  return (
    <article className="py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400 tracking-wide">
            #{order.id.slice(0, 8)} · {formattedDate}
          </p>
        </div>
        <span className={`rounded px-2.5 py-1 text-[11px] font-medium ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 flex gap-4">
        <Link
          href={`/products/${mainItem?.product_id || ""}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-50"
        >
          {imageSrc ? (
            <Image src={imageSrc} alt={itemName} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-gray-300">—</div>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">{itemBrand}</p>
          <p className="truncate text-sm font-medium text-gray-900">{itemName}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {mainItem?.quantity || 1} × {mainItem?.size ? `EU ${mainItem.size}` : "—"}
          </p>
          {moreCount > 0 && <p className="mt-0.5 text-xs text-gray-300">+ {moreCount} more</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">{total}</p>
        <div className="flex items-center gap-3">
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel(order.id)}
              disabled={isCancelling}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              {isCancelling ? "Цуцлаж байна..." : "Цуцлах"}
            </button>
          )}
          <span className="text-[11px] text-gray-300">
            +{order.earned_xp || 0} XP
          </span>
        </div>
      </div>
    </article>
  );
}
