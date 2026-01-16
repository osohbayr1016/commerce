'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm('Та энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?')) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      alert('Бүтээгдэхүүн устгахад алдаа гарлаа');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-block px-3 py-1 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
    >
      {deleting ? 'Устгаж байна...' : 'Устгах'}
    </button>
  );
}
