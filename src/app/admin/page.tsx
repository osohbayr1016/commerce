import { createClient } from "@/lib/supabase/server";
import {
  SalesChart,
  ProductPerformanceChart,
} from "@/components/admin/AnalyticsCharts";
import { getAnalyticsData } from "@/lib/analytics";

export const revalidate = 300;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const analytics = await getAnalyticsData("month");

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
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Хүлээгдэж буй",
      processing: "Боловсруулж буй",
      shipped: "Илгээсэн",
      delivered: "Хүргэгдсэн",
      cancelled: "Цуцалсан",
    };
    return texts[status] || status;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          Хянах самбар
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Борлуулалт болон гүйцэтгэлийн мэдээлэл
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Нийт орлого</p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                analytics.overview.revenueGrowth >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formatPercent(analytics.overview.revenueGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {formatCurrency(analytics.overview.totalRevenue)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Нийт захиалга</p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                analytics.overview.ordersGrowth >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formatPercent(analytics.overview.ordersGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {analytics.overview.totalOrders}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Дундаж захиалга</p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                analytics.overview.avgOrderGrowth >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formatPercent(analytics.overview.avgOrderGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {formatCurrency(analytics.overview.avgOrderValue)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Нийт хэрэглэгч</p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                analytics.overview.usersGrowth >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formatPercent(analytics.overview.usersGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {analytics.overview.totalUsers}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Хөрвүүлэлтийн хувь
            </p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                analytics.overview.conversionGrowth >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formatPercent(analytics.overview.conversionGrowth)}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {analytics.overview.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <SalesChart data={analytics.salesChart} />
        <ProductPerformanceChart
          data={analytics.categoryPerformance.slice(0, 5)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Топ бүтээгдэхүүн
          </h2>
          <div className="space-y-3">
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="text-base sm:text-lg font-semibold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {product.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {product.sales} борлуулалт
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base ml-2">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Сүүлийн захиалгууд
          </h2>
          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {order.user_name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("mn-MN")}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Шуурхай холбоосууд
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <a
            href="/admin/products"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Бүтээгдэхүүн нэмэх
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Шинэ бүтээгдэхүүн үүсгэх
            </p>
          </a>

          <a
            href="/admin/categories"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Ангилал удирдах
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Ангилал нэмэх, засах
            </p>
          </a>

          <a
            href="/admin/orders"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Захиалга харах
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Захиалгуудыг удирдах
            </p>
          </a>

          <a
            href="/admin/referral/top6"
            className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Top 6 удирдах
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Referral Top 6 гишүүд
            </p>
          </a>

          <a
            href="/admin/referral/analytics"
            className="p-4 border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Referral Analytics
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Referral мэдээлэл харах
            </p>
          </a>

          <a
            href="/admin/referral/network"
            className="p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Referral Network
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Сүлжээний бүтэц харах
            </p>
          </a>

          <a
            href="/admin/spin"
            className="p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              🎰 Spin Wheel
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Spin бүтээгдэхүүн удирдах
            </p>
          </a>

          <a
            href="/admin/settings"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              Тохиргоо
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Вэбсайтын тохиргоо засах
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
