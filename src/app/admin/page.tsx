import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Fetch stats
  const [productsResult, categoriesResult, ordersResult] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
  ]);
  
  const stats = [
    {
      label: 'Нийт бүтээгдэхүүн',
      value: productsResult.count || 0,
    },
    {
      label: 'Ангилал',
      value: categoriesResult.count || 0,
    },
    {
      label: 'Захиалга',
      value: ordersResult.count || 0,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Хянах самбар
        </h1>
        <p className="text-base text-gray-600">
          Админ хяналтын самбарт тавтай морилно уу
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Шуурхай холбоосууд
        </h2>
        <div className="grid grid-cols-2 gap-4">
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
