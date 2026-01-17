import { createClient } from '@/lib/supabase/server';
import { SalesChart, ProductPerformanceChart } from '@/components/admin/AnalyticsCharts';
import { getAnalyticsData } from '@/lib/analytics';

export const revalidate = 300;

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const analytics = await getAnalyticsData('month');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Хүлээгдэж буй',
      processing: 'Боловсруулж буй',
      shipped: 'Илгээсэн',
      delivered: 'Хүргэгдсэн',
      cancelled: 'Цуцалсан',
    };
    return texts[status] || status;
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Хянах самбар
        </h1>
        <p className="text-base text-gray-600">
          Борлуулалт болон гүйцэтгэлийн мэдээлэл
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Нийт орлого</p>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              analytics.overview.revenueGrowth >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {formatPercent(analytics.overview.revenueGrowth)}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(analytics.overview.totalRevenue)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Нийт захиалга</p>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              analytics.overview.ordersGrowth >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {formatPercent(analytics.overview.ordersGrowth)}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {analytics.overview.totalOrders}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Дундаж захиалга</p>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              analytics.overview.avgOrderGrowth >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {formatPercent(analytics.overview.avgOrderGrowth)}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(analytics.overview.avgOrderValue)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Шинэ хэрэглэгч</p>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              analytics.overview.usersGrowth >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {formatPercent(analytics.overview.usersGrowth)}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {analytics.overview.totalUsers}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Хөрвүүлэлтийн хувь</p>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              analytics.overview.conversionGrowth >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {formatPercent(analytics.overview.conversionGrowth)}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {analytics.overview.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesChart data={analytics.salesChart} />
        <ProductPerformanceChart data={analytics.categoryPerformance.slice(0, 5)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Топ бүтээгдэхүүн
          </h2>
          <div className="space-y-3">
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} борлуулалт</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Сүүлийн захиалгууд
          </h2>
          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{order.user_name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('mn-MN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 mb-1">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Шуурхай холбоосууд
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              Бүтээгдэхүүн нэмэх
            </h3>
            <p className="text-sm text-gray-600">
              Шинэ бүтээгдэхүүн үүсгэх
            </p>
          </a>
          
          <a
            href="/admin/categories"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              Ангилал удирдах
            </h3>
            <p className="text-sm text-gray-600">
              Ангилал нэмэх, засах
            </p>
          </a>
          
          <a
            href="/admin/orders"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              Захиалга харах
            </h3>
            <p className="text-sm text-gray-600">
              Захиалгуудыг удирдах
            </p>
          </a>
          
          <a
            href="/admin/settings"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              Тохиргоо
            </h3>
            <p className="text-sm text-gray-600">
              Вэбсайтын тохиргоо засах
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
