import { createClient } from '@/lib/supabase/server';

export default async function OrdersPage() {
  const supabase = await createClient();
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Захиалга
        </h1>
        <p className="text-base text-gray-600">
          Захиалгуудыг харах ба удирдах
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Хэрэглэгч
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Дүн
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Төлөв
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Огноо
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.profiles?.full_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.total_amount?.toLocaleString()} ₮
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('mn-MN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600">Захиалга байхгүй байна</p>
        </div>
      )}
    </div>
  );
}
