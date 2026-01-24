'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminUser {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
  xp?: number;
  tier_level?: number;
  coin_balance?: number;
  promo_code?: string | null;
  is_top6?: boolean;
  total_referrals?: number;
}

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(page * limit) });
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Алдаа');
      setUsers(data.users || []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Хэрэглэгч татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const updateRole = async (id: string, role: 'user' | 'admin') => {
    setActionLoading(id);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Алдаа');
      setSuccess(`Эрх шинэчлэгдлээ: ${role === 'admin' ? 'Админ' : 'Хэрэглэгч'}`);
      fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Эрх шинэчлэхэд алдаа');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (s?: string | null) =>
    s ? new Date(s).toLocaleDateString('mn-MN', { dateStyle: 'short' }) : '—';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Хэрэглэгчийн удирдлага</h2>
        <p className="text-gray-600 mt-1">Бүртгэлтэй хэрэглэгчдийг харах, эрх өгөх/хасах</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Нэр, имэйл, утас, promo кодоор хайх..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Ачааллаж байна...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Хэрэглэгч олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">Нэр</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">Имэйл</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">Утас</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">Эрх</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">Бүртгэсэн</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.full_name || '—'}</div>
                      {u.promo_code && (
                        <div className="text-xs text-gray-500">Promo: {u.promo_code}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{u.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{u.phone_number || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                      </span>
                      {u.is_top6 && (
                        <span className="ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Top 6
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      {u.role === 'admin' ? (
                        user?.id === u.id ? (
                          <span className="text-gray-400 text-sm">Та</span>
                        ) : (
                          <button
                            onClick={() => updateRole(u.id, 'user')}
                            disabled={!!actionLoading}
                            className="text-sm text-red-600 hover:underline disabled:opacity-50"
                          >
                            {actionLoading === u.id ? '...' : 'Эрх хасах'}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => updateRole(u.id, 'admin')}
                          disabled={!!actionLoading}
                          className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
                        >
                          {actionLoading === u.id ? '...' : 'Админ болгох'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-600">
              Нийт {total} хэрэглэгч
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Өмнөх
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * limit >= total}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Дараах
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
