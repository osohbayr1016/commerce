'use client';

import { useState } from 'react';

export default function FixImagesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  async function handleFix() {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/fix-image-urls', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix images');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        Зургийн URL-ийг засах
      </h1>
      <p className="text-gray-600 mb-6">
        Cloudflare R2-д хадгалсан зургуудын URL-ийг зөв хэлбэрт оруулна.
        Энэ нь <code className="bg-gray-100 px-2 py-1 rounded">/commerce/products/</code> гэсэн хэсгийг арилгаж{' '}
        <code className="bg-gray-100 px-2 py-1 rounded">/products/</code> болгоно.
      </p>

      <button
        onClick={handleFix}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {loading ? 'Засч байна...' : 'Зургийн URL засах'}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
          <strong>Алдаа:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg">
          <strong>Амжилттай!</strong>
          <ul className="mt-2 space-y-1">
            <li>• {result.message}</li>
            <li>• Нийт бүтээгдэхүүн: {result.total}</li>
            <li>• Засагдсан: {result.updated}</li>
          </ul>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <strong>Алдаанууд:</strong>
              <ul className="mt-2 space-y-1">
                {result.errors.map((err: string, idx: number) => (
                  <li key={idx} className="text-sm">• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
