'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function PromoCodeManager() {
  const { profile, refreshProfile } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/referral/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/referral/create-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setEditing(false);
        await refreshProfile();
        await fetchStats();
      } else {
        setError(data.error || 'Алдаа гарлаа');
      }
    } catch (err) {
      setError('Сүлжээний алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (profile?.promo_code) {
      navigator.clipboard.writeText(profile.promo_code);
      setSuccess('Promo код хуулагдлаа!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const progress30M = stats ? Math.min((stats.purchases_30d / stats.threshold_30m) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Таны Promo Code
        </h3>

        {!editing ? (
          <div className="space-y-4">
            {profile?.promo_code ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg font-bold text-gray-900">
                    {profile.promo_code}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    Хуулах
                  </button>
                </div>
                <button
                  onClick={() => {
                    setPromoCode(profile.promo_code || '');
                    setEditing(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Өөрчлөх
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Promo код үүсгэх
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="MYCODE123"
                maxLength={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                3-20 тэмдэгт, зөвхөн үсэг болон тоо
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading || !promoCode}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setError('');
                }}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Болих
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
      </div>

      {loadingStats ? (
        <div className="text-center py-8 text-gray-500">Уншиж байна...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">Нийт Referral</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.referral_count}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">Цуглуулсан Discount</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {stats.accumulated_discount_percent}%
            </p>
          </div>

          <div className="col-span-full bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">
                30 сарын худалдан авалт
              </p>
              <p className="text-sm font-semibold text-gray-900">
                ₮{stats.purchases_30d?.toLocaleString()} / ₮30,000,000
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${progress30M}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.can_use_discount
                ? '✓ Discount ашиглах эрхтэй байна'
                : `30 саяд хүрэхэд ₮${(30000000 - stats.purchases_30d).toLocaleString()} дутуу байна`}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
