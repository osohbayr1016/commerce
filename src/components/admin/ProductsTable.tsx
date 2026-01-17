'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteProductButton from '@/app/admin/products/DeleteProductButton';
import BulkActionsBar from '@/components/admin/BulkActionsBar';
import BulkUpdateModal from '@/components/admin/BulkUpdateModal';
import { useModal } from '@/hooks/useModal';

interface Product {
  id: string;
  name_en: string | null;
  name_mn: string | null;
  title: string | null;
  brand: string | null;
  price: number | null;
  discount: number | null;
  stock: number | null;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkModalType, setBulkModalType] = useState<'price' | 'stock'>('price');
  const router = useRouter();
  const modal = useModal();

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: Array.from(selectedIds) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete products');
      }

      modal.showSuccess('Амжилттай', `${data.count} бүтээгдэхүүн устгагдлаа`);
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      modal.showError(
        'Алдаа',
        error instanceof Error ? error.message : 'Устгахад алдаа гарлаа'
      );
    }
  };

  const handleBulkUpdate = async (value: number, actionType: string) => {
    try {
      let action = '';
      let apiValue = value;

      if (bulkModalType === 'price') {
        if (actionType === 'increase') {
          action = 'adjustPrice';
          apiValue = value;
        } else if (actionType === 'decrease') {
          action = 'adjustPrice';
          apiValue = -value;
        } else {
          action = 'updatePrice';
        }
      } else {
        action = 'updateStock';
      }

      const response = await fetch('/api/admin/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: Array.from(selectedIds),
          action,
          value: apiValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update products');
      }

      modal.showSuccess('Амжилттай', `${data.count} бүтээгдэхүүн шинэчлэгдлээ`);
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      modal.showError(
        'Алдаа',
        error instanceof Error ? error.message : 'Шинэчлэхэд алдаа гарлаа'
      );
    }
  };

  const allSelected = selectedIds.size === products.length && products.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < products.length;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
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
              <tr
                key={product.id}
                className={`hover:bg-gray-50 ${
                  selectedIds.has(product.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelection(product.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>
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

      <BulkActionsBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkDelete={handleBulkDelete}
        onBulkPriceUpdate={() => {
          setBulkModalType('price');
          setBulkModalOpen(true);
        }}
        onBulkStockUpdate={() => {
          setBulkModalType('stock');
          setBulkModalOpen(true);
        }}
      />

      <BulkUpdateModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        type={bulkModalType}
        selectedCount={selectedIds.size}
        onSubmit={handleBulkUpdate}
      />
    </>
  );
}
