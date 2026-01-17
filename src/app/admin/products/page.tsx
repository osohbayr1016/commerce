import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ProductsTable from '@/components/admin/ProductsTable';
import AdminPagination from './AdminPagination';

interface ProductsPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const page = parseInt(params?.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;
  
  const { data: products, error, count } = await supabase
    .from('products')
    .select('id, name_en, name_mn, title, brand, price, discount, stock, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
  }
  
  const totalPages = Math.ceil((count || 0) / limit);

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
        <div className="space-y-4">
          <ProductsTable products={products} />
          <AdminPagination currentPage={page} totalPages={totalPages} basePath="/admin/products" />
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
