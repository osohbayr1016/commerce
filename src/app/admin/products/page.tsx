import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';

export default async function ProductsPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Бүтээгдэхүүн
          </h1>
          <p className="text-base text-gray-600">
            Бүтээгдэхүүнүүдийг удирдах
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
        >
          + Бүтээгдэхүүн нэмэх
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Нэр
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Брэнд
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Үнэ
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Хөнгөлөлт
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Нөөц
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name_en || product.title}
                    </div>
                    <div className="text-sm text-gray-500">{product.name_mn}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.brand || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.price?.toLocaleString()} ₮
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.discount ? `-${product.discount}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-block px-3 py-1 text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Засах
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">Бүтээгдэхүүн байхгүй байна</p>
          <Link
            href="/admin/products/new"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
          >
            Эхний бүтээгдэхүүнээ нэмэх
          </Link>
        </div>
      )}
    </div>
  );
}
