'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const modal = useModal();

  const handleDelete = async () => {
    modal.showConfirm(
      'Бүтээгдэхүүн устгах',
      'Та энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?',
      async () => {
        setDeleting(true);
        try {
          const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || 'Delete failed');

          modal.showSuccess(
            'Амжилттай',
            'Бүтээгдэхүүн амжилттай устгагдлаа'
          );
          router.push('/admin/products');
          router.refresh();
        } catch (error) {
          modal.showError(
            'Алдаа',
            'Бүтээгдэхүүн устгахад алдаа гарлаа'
          );
        } finally {
          setDeleting(false);
        }
      },
      'Устгах',
      'Болих'
    );
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {deleting ? 'Устгаж байна...' : 'Устгах'}
    </button>
  );
}
