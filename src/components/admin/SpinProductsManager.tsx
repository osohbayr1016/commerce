/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import type { SpinProduct, Product, SpinStatistics } from '@/types';

export default function SpinProductsManager() {
  const [spinProducts, setSpinProducts] = useState<SpinProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<SpinStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSpinProducts();
    fetchAvailableProducts();
    fetchStatistics();
  }, []);

  const fetchSpinProducts = async () => {
    try {
      const res = await fetch('/api/admin/spin/products');
      if (res.ok) {
        const data = await res.json();
        setSpinProducts(data);
      }
    } catch (err) {
      console.error('Error fetching spin products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setAvailableProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await fetch('/api/admin/spin/statistics?days=30');
      if (res.ok) {
        const data = await res.json();
        setStatistics(data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId) {
      setError('Бүтээгдэхүүн сонгоно уу');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/spin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProductId,
          display_name: customName || null,
          image_url: customImage || null,
          is_active: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Амжилттай нэмэгдлээ!');
        setSpinProducts([data, ...spinProducts]);
        setShowAddModal(false);
        setSelectedProductId('');
        setCustomName('');
        setCustomImage('');
        fetchStatistics();
      } else {
        setError(data.error || 'Алдаа гарлаа');
      }
    } catch (err) {
      setError('Серверийн алдаа гарлаа');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/spin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          is_active: !currentStatus,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSpinProducts(
          spinProducts.map((sp) => (sp.id === id ? updated : sp))
        );
        setSuccess('Статус шинэчлэгдлээ');
        fetchStatistics();
      }
    } catch (err) {
      setError('Алдаа гарлаа');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ бүтээгдэхүүнийг spin-аас хасах уу?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/spin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSpinProducts(spinProducts.filter((sp) => sp.id !== id));
        setSuccess('Амжилттай устгагдлаа');
        fetchStatistics();
      }
    } catch (err) {
      setError('Алдаа гарлаа');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter products that are not in spin yet
  const filteredAvailableProducts = availableProducts
    .filter((p) => !spinProducts.some((sp) => sp.product_id === p.id))
    .filter((p) =>
      searchQuery
        ? (p.name_mn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    );

  const activeCount = spinProducts.filter((sp) => sp.is_active).length;

  if (loading) {
    return <div className="p-8 text-center">Ачааллаж байна...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            🎰 Spin Wheel Бүтээгдэхүүн
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Spin дээр харагдах бүтээгдэхүүнүүдийг удирдах
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Бүтээгдэхүүн нэмэх
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className=" from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Нийт Spin</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {statistics.total_spins}
            </div>
            <div className="text-xs text-blue-700 mt-1">Сүүлийн 30 хоног</div>
          </div>
          <div className=" from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Орлого</div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              ₮{(statistics.total_revenue_mnt || 0).toLocaleString()} 
            </div>
            <div className="text-xs text-green-700 mt-1">
              {statistics.unique_users} хэрэглэгч
            </div>      
          </div>
          <div className=" from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">
              Дундаж Spin
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {statistics.avg_spins_per_user.toFixed(1)}
            </div>
            <div className="text-xs text-purple-700 mt-1">
              хэрэглэгч тутамд
            </div>
          </div>
          <div className=" from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">
              Идэвхтэй
            </div>
            <div className="text-2xl font-bold text-orange-900 mt-1">
              {activeCount}
            </div>
            <div className="text-xs text-orange-700 mt-1">
              /{spinProducts.length} бүтээгдэхүүн
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Spin Бүтээгдэхүүн ({spinProducts.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {spinProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Spin бүтээгдэхүүн байхгүй байна
            </div>
          ) : (
            spinProducts.map((sp) => (
              <div key={sp.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <img
                    src={sp.image_url || sp.product?.image_url || '/placeholder.png'}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {sp.display_name || sp.product?.name_mn || 'No name'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {sp.product?.brand} • ₮{(sp.product?.price || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Нэмсэн: {new Date(sp.created_at).toLocaleDateString('mn-MN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(sp.id, sp.is_active)}
                      disabled={actionLoading}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        sp.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sp.is_active ? '✓ Идэвхтэй' : '✗ Идэвхгүй'}
                    </button>
                    <button
                      onClick={() => handleDelete(sp.id)}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Spin-д бүтээгдэхүүн нэмэх
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бүтээгдэхүүн хайх
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Нэр, брэнд..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бүтээгдэхүүн сонгох *
                </label>
                <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                  {filteredAvailableProducts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Боломжтой бүтээгдэхүүн байхгүй
                    </div>
                  ) : (
                    filteredAvailableProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProductId(product.id!)}
                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                          selectedProductId === product.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url || '/placeholder.png'}
                            alt=""
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {product.name_mn}
                            </div>
                            <div className="text-sm text-gray-600">
                              {product.brand} • ₮{(product.price || 0).toLocaleString()}
                            </div>
                          </div>
                          {selectedProductId === product.id && (
                            <span className="text-blue-600">✓</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Custom Name (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spin дээрх нэр (заавал биш)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Анхны нэрийг ашиглана"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Custom Image (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spin дээрх зураг URL (заавал биш)
                </label>
                <input
                  type="text"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  placeholder="Анхны зургийг ашиглана"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedProductId('');
                  setCustomName('');
                  setCustomImage('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Болих
              </button>
              <button
                onClick={handleAddProduct}
                disabled={actionLoading || !selectedProductId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? 'Нэмж байна...' : 'Нэмэх'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
