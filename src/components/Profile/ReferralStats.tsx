/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';

interface ReferredUser {
  id: string;
  display_name: string;
  created_at: string;
}

interface DiscountEvent {
  id: string;
  discount_percent: number;
  purchase_amount_mnt: number;
  created_at: string;
  earned_from: string;
}

export default function ReferralStats() {
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [discountEvents, setDiscountEvents] = useState<DiscountEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/referral/stats');
      if (response.ok) {
        const data = await response.json();
        setReferredUsers(data.referred_users || []);
        setDiscountEvents(data.recent_discount_events || []);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Уншиж байна...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Таны Referral хүмүүс
        </h3>

        {referredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Одоогоор хэн ч таны promo код ашиглаагүй байна
          </p>
        ) : (
          <div className="space-y-3">
            {referredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.display_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.display_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Бүртгүүлсэн: {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Discount олсон түүх
        </h3>

        {discountEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Одоогоор discount олоогүй байна
          </p>
        ) : (
          <div className="space-y-3">
            {discountEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 from-green-50 to-emerald-50 border border-green-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🎉</span>
                    <p className="font-semibold text-gray-900">
                      +{event.discount_percent}% Discount олсон
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.earned_from} - ₮
                    {event.purchase_amount_mnt.toLocaleString()} худалдан авалт
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(event.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    +{event.discount_percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-900 mb-2">
          Яаж discount олох вэ?
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>
              Таны promo код ашиглан хүн бүртгүүлнэ
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>
              Тэр хүн сүүлийн 30 хоногт 5 сая төгрөгийн худалдан авалт хийнэ
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>
              Та автоматаар 2% discount авна (Limit байхгүй!)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>
              Та өөрөө 30 сая төгрөгийн худалдан авалт хийсэн байж discount
              ашиглах эрхтэй болно
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
