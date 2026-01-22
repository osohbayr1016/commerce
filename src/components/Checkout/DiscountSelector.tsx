/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface DiscountSelectorProps {
  subtotal: number;
  onDiscountChange: (discountPercent: number) => void;
}

export default function DiscountSelector({
  subtotal,
  onDiscountChange,
}: DiscountSelectorProps) {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPercent, setSelectedPercent] = useState(0);

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
      setLoading(false);
    }
  };

  const handleDiscountChange = (percent: number) => {
    setSelectedPercent(percent);
    onDiscountChange(percent);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-500">Уншиж байна...</p>
      </div>
    );
  }

  if (!stats || !profile) {
    return null;
  }

  const availableDiscount = profile.accumulated_discount_percent || 0;
  const canUseDiscount = stats.can_use_discount;
  const maxDiscountAmount = Math.floor((subtotal * availableDiscount) / 100);

  if (availableDiscount === 0) {
    return null;
  }

  return (
    <div className=" from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🎁</span>
        <h3 className="font-semibold text-gray-900">
          Referral Discount
        </h3>
      </div>

      {!canUseDiscount ? (
        <div className="bg-white border border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-2">
            Та <span className="font-bold">{availableDiscount}%</span> discount
            цуглуулсан байна!
          </p>
          <p className="text-xs text-red-600">
            Discount ашиглахын тулд сүүлийн 30 хоногт 30 сая төгрөгийн
            худалдан авалт хийх шаардлагатай.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Одоогийн үлдэгдэл: ₮{stats.purchases_30d?.toLocaleString()} / ₮
            30,000,000
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">
                Боломжтой discount:
              </span>
              <span className="text-lg font-bold text-green-600">
                {availableDiscount}%
              </span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="discount"
                  checked={selectedPercent === 0}
                  onChange={() => handleDiscountChange(0)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Discount ашиглахгүй
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="discount"
                  checked={selectedPercent === availableDiscount}
                  onChange={() => handleDiscountChange(availableDiscount)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Бүх discount ашиглах ({availableDiscount}%)
                </span>
              </label>
            </div>
          </div>

          {selectedPercent > 0 && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900">
                  Хямдрал:
                </span>
                <span className="text-lg font-bold text-green-600">
                  -₮{maxDiscountAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {selectedPercent}% discount ашигласан
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            💡 Та энэ discount-г зөвхөн нэг удаа ашиглах боломжтой
          </p>
        </div>
      )}
    </div>
  );
}
