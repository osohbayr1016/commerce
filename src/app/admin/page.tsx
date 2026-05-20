import Image from "next/image";
import Link from "next/link";
import {
  DynamicSalesChart,
  DynamicProductPerformanceChart,
} from "@/components/admin/DynamicAnalyticsCharts";
import { getAnalyticsData } from "@/lib/analytics";
import QuickActions from "@/components/admin/QuickActions";

// We force dynamic behavior because we consume searchParams dynamically
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = (params?.period === "week" || params?.period === "year" ? params.period : "month") as "week" | "month" | "year";
  
  // Dynamic server-side data fetch based on current selected period parameter
  const analytics = await getAnalyticsData(period);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: "MNT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-50 text-amber-800 border-amber-200/50",
      processing: "bg-blue-50 text-blue-800 border-blue-200/50",
      confirmed: "bg-neutral-900 text-neutral-100 border-neutral-800",
      shipped: "bg-purple-50 text-purple-800 border-purple-200/50",
      delivered: "bg-emerald-50 text-emerald-800 border-emerald-200/50",
      cancelled: "bg-red-50 text-red-800 border-red-200/50",
    };
    return colors[status] || "bg-gray-50 text-gray-800 border-gray-200";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Хүлээгдэж буй",
      processing: "Боловсруулж буй",
      confirmed: "Баталгаажсан",
      shipped: "Илгээсэн",
      delivered: "Хүргэгдсэн",
      cancelled: "Цуцалсан",
    };
    return texts[status] || status;
  };

  const timeframes = [
    { key: "week", label: "7 хоног" },
    { key: "month", label: "30 хоног" },
    { key: "year", label: "12 сар" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Dashboard Top Header & Timeframe Controllers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/60 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-heading">
            Хянах самбар
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Борлуулалт, захиалгын гүйцэтгэл болон системийн мэдээлэл
          </p>
        </div>

        {/* Premium Segmented Timeframe Controls */}
        <div className="flex bg-neutral-100/80 border border-neutral-200 p-1 rounded-xl shrink-0 self-start sm:self-auto shadow-xs">
          {timeframes.map((tf) => {
            const isSelected = period === tf.key;
            return (
              <Link
                key={tf.key}
                href={`/admin?period=${tf.key}`}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isSelected
                    ? "bg-white text-neutral-900 shadow-xs border border-neutral-200/30"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tf.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 6 Premium Stripe-Style Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric Card 1: Revenue */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Нийт орлого
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                analytics.overview.revenueGrowth >= 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                  : "bg-red-50 text-red-700 border-red-200/40"
              }`}
            >
              {formatPercent(analytics.overview.revenueGrowth)}
            </span>
          </div>
          <p
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 truncate font-heading font-mono"
            title={formatCurrency(analytics.overview.totalRevenue)}
          >
            {formatCurrency(analytics.overview.totalRevenue)}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/20 group-hover:bg-amber-400/50 transition-colors"></div>
        </div>

        {/* Metric Card 2: Orders */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Нийт захиалга
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                analytics.overview.ordersGrowth >= 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                  : "bg-red-50 text-red-700 border-red-200/40"
              }`}
            >
              {formatPercent(analytics.overview.ordersGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 truncate font-heading font-mono">
            {analytics.overview.totalOrders}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/20 group-hover:bg-amber-400/50 transition-colors"></div>
        </div>

        {/* Metric Card 3: Avg Basket */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Дундаж захиалга
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                analytics.overview.avgOrderGrowth >= 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                  : "bg-red-50 text-red-700 border-red-200/40"
              }`}
            >
              {formatPercent(analytics.overview.avgOrderGrowth)}
            </span>
          </div>
          <p
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 truncate font-heading font-mono"
            title={formatCurrency(analytics.overview.avgOrderValue)}
          >
            {formatCurrency(analytics.overview.avgOrderValue)}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/20 group-hover:bg-amber-400/50 transition-colors"></div>
        </div>

        {/* Metric Card 4: Users */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Нийт хэрэглэгч
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                analytics.overview.usersGrowth >= 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                  : "bg-red-50 text-red-700 border-red-200/40"
              }`}
            >
              {formatPercent(analytics.overview.usersGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 truncate font-heading font-mono">
            {analytics.overview.totalUsers}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/20 group-hover:bg-amber-400/50 transition-colors"></div>
        </div>

        {/* Metric Card 5: Catalog */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Бүтээгдэхүүн
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                analytics.overview.productsGrowth >= 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                  : "bg-red-50 text-red-700 border-red-200/40"
              }`}
            >
              {formatPercent(analytics.overview.productsGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 truncate font-heading font-mono">
            {analytics.overview.totalProducts}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/20 group-hover:bg-amber-400/50 transition-colors"></div>
        </div>

        {/* Metric Card 6: Conversion */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Хөрвүүлэлт
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                analytics.overview.conversionGrowth >= 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                  : "bg-red-50 text-red-700 border-red-200/40"
              }`}
            >
              {formatPercent(analytics.overview.conversionGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 truncate font-heading font-mono">
            {analytics.overview.conversionRate.toFixed(2)}%
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/20 group-hover:bg-amber-400/50 transition-colors"></div>
        </div>
      </div>

      {/* Interactive Admin Tool Kit */}
      <QuickActions recentOrders={analytics.recentOrders} />

      {/* Performance & Sales Charts Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <DynamicSalesChart data={analytics.salesChart} />
        <DynamicProductPerformanceChart
          data={analytics.categoryPerformance.slice(0, 5)}
        />
      </div>

      {/* detailed logs and leaderboard cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Top Product Standings */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs min-w-0 lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Топ бүтээгдэхүүн
            </h3>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase">Борлуулалт</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 pb-3.5 border-b border-neutral-50 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-bold font-mono text-neutral-400 w-5 text-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-800 text-xs sm:text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {product.sales} ширхэг
                    </p>
                  </div>
                </div>
                <p className="font-bold text-neutral-900 text-xs sm:text-sm font-mono shrink-0 whitespace-nowrap">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
            {analytics.topProducts.length === 0 && (
              <p className="text-xs text-neutral-500 text-center py-6">Мэдээлэл байхгүй байна.</p>
            )}
          </div>
        </div>

        {/* Stripe-like Recent Sales Ledger */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs min-w-0 lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Сүүлийн захиалгууд
            </h3>
            <Link
              href="/admin/orders"
              className="text-[10px] font-bold text-amber-600 hover:text-amber-700 tracking-wider uppercase"
            >
              Бүх захиалга →
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {analytics.recentOrders.slice(0, 6).map((order) => {
              const thumbnails = (order.items || [])
                .map((item) => item.product?.images?.[0])
                .filter(Boolean) as string[];
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 pb-3.5 border-b border-neutral-50 last:border-0 last:pb-0"
                >
                  <div className="flex shrink-0 gap-1">
                    {thumbnails.length > 0 ? (
                      thumbnails.slice(0, 2).map((src, i) => (
                        <div
                          key={`${order.id}-${i}`}
                          className="relative w-8 h-8 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400 text-xs">
                        —
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-800 text-xs sm:text-sm truncate">
                      {order.user_name}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      #{order.id.slice(0, 8).toUpperCase()} • {new Date(order.created_at).toLocaleDateString("mn-MN")}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <p className="font-bold text-neutral-900 text-xs sm:text-sm font-mono whitespace-nowrap">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border tracking-wide uppercase ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              );
            })}
            {analytics.recentOrders.length === 0 && (
              <p className="text-xs text-neutral-500 text-center py-6">Захиалга байхгүй байна.</p>
            )}
          </div>
        </div>
      </div>

      {/* Command Shortcut Portal Grid */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-widest mb-4">
          Шуурхай холбоосууд
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products"
            className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50/50 hover:border-neutral-300 transition-all group"
          >
            <h3 className="font-semibold text-neutral-800 group-hover:text-amber-600 transition-colors text-xs sm:text-sm">
              📦 Бүтээгдэхүүн нэмэх
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1">
              Шинэ бүтээгдэхүүн үүсгэх ба удирдах
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50/50 hover:border-neutral-300 transition-all group"
          >
            <h3 className="font-semibold text-neutral-800 group-hover:text-amber-600 transition-colors text-xs sm:text-sm">
              🏷️ Ангилал удирдах
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1">
              Male, Female, Accessory, Perfume ангилал
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50/50 hover:border-neutral-300 transition-all group"
          >
            <h3 className="font-semibold text-neutral-800 group-hover:text-amber-600 transition-colors text-xs sm:text-sm">
              🛒 Захиалга харах
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1">
              Гүйлгээний бүх захиалгыг удирдах
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50/50 hover:border-neutral-300 transition-all group"
          >
            <h3 className="font-semibold text-neutral-800 group-hover:text-amber-600 transition-colors text-xs sm:text-sm">
              ⚙️ Систем Тохиргоо
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1">
              Вэбсайт ба платформын ерөнхий тохиргоо засах
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
