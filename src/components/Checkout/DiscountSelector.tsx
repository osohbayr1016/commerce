"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";

interface DiscountSelectorProps {
  subtotal: number;
  onDiscountChange: (discountPercent: number) => void;
}

const REFERRAL_THRESHOLD_MNT = 30_000_000;

export default function DiscountSelector({
  subtotal,
  onDiscountChange,
}: DiscountSelectorProps) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<{
    can_use_discount?: boolean;
    purchases_30d?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPercent, setSelectedPercent] = useState(0);

  useEffect(() => {
    fetch("/api/referral/stats")
      .then((res) => (res.ok ? res.json() : { stats: null }))
      .then((data) => setStats(data.stats ?? null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const handleDiscountChange = (percent: number) => {
    setSelectedPercent(percent);
    onDiscountChange(percent);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-500">{t("checkout.reading")}</p>
      </div>
    );
  }

  if (!stats || !profile) return null;

  const availableDiscount = profile.accumulated_discount_percent || 0;
  const canUseDiscount = stats.can_use_discount;
  const maxDiscountAmount = Math.floor((subtotal * availableDiscount) / 100);

  if (availableDiscount === 0) return null;

  return (
    <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎁</span>
        <h3 className="font-semibold text-gray-900">
          {t("checkout.referralDiscount")}
        </h3>
      </div>

      {!canUseDiscount ? (
        <div className="bg-white border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-2">
            {t("checkout.availableDiscountPercent", {
              percent: availableDiscount,
            })}
          </p>
          <p className="text-xs text-red-600">
            {t("checkout.minimumSpendRequired", {
              amount: formatCurrency(REFERRAL_THRESHOLD_MNT, "MNT"),
            })}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {t("checkout.balance30d", {
              current: formatCurrency(stats.purchases_30d ?? 0, "MNT"),
              required: formatCurrency(REFERRAL_THRESHOLD_MNT, "MNT"),
            })}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">
                {t("checkout.availableDiscountPercent", {
                  percent: availableDiscount,
                })}
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
                  {t("checkout.useNoDiscount")}
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
                  {t("checkout.useFullDiscount", { percent: availableDiscount })}
                </span>
              </label>
            </div>
          </div>
          {selectedPercent > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900">
                  {t("checkout.discountDeduction")}
                </span>
                <span className="text-lg font-bold text-green-600">
                  -{formatCurrency(maxDiscountAmount, "MNT")}
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {selectedPercent}% {t("checkout.promoApplied").toLowerCase()}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500">
            💡 {t("checkout.oneTimeUse")}
          </p>
        </div>
      )}
    </div>
  );
}
