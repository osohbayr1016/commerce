'use client';

import { useState, useEffect } from 'react';

export default function ReferralAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/referral-analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Уншиж байна...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-500">Мэдээлэл алга</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Нийт хэрэглэгчид</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {analytics.summary?.total_users || 0}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Referral бүхий</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {analytics.summary?.users_with_referrals || 0}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Нийт referrals</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {analytics.summary?.total_referrals || 0}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Дундаж referral</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {analytics.summary?.avg_referrals_per_user?.toFixed(1) || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Хамгийн их ашиглагдсан Promo Code
          </h3>
          {analytics.top_promo_codes?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Мэдээлэл байхгүй</p>
          ) : (
            <div className="space-y-2">
              {analytics.top_promo_codes?.slice(0, 5).map((item: any, index: number) => (
                <div
                  key={item.promo_code}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <span className="font-mono font-semibold text-gray-900">
                      {item.promo_code}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {item.usage_count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Referrers
          </h3>
          {analytics.top_referrers?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Мэдээлэл байхгүй</p>
          ) : (
            <div className="space-y-2">
              {analytics.top_referrers?.slice(0, 5).map((user: any, index: number) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.full_name || 'Хэрэглэгч'}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {user.promo_code || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {user.total_referrals}
                    </p>
                    <p className="text-xs text-yellow-600">
                      {user.accumulated_discount_percent}% discount
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Discount тархалт
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(analytics.discount_distribution || {}).map(([range, count]) => (
            <div
              key={range}
              className="border border-gray-200 rounded-lg p-4 text-center"
            >
              <p className="text-sm text-gray-600 mb-1">{range}</p>
              <p className="text-2xl font-bold text-gray-900">{count as number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* eslint-disable-next-line */}
      <div className=" from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Нийт олгосон Discount
        </h3>
        <p className="text-5xl font-bold text-purple-600">
          {analytics.summary?.total_discount_awarded || 0}%
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Бүх хэрэглэгчдийн нийлбэр
        </p>
      </div>
    </div>
  );
}
