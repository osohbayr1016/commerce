"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/ToastContainer";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";

interface PromoCodeInputProps {
  orderAmount: number;
  onApply: (discount: number, promoCodeId: string) => void;
}

export default function PromoCodeInput({
  orderAmount,
  onApply,
}: PromoCodeInputProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleApply = async () => {
    if (!code.trim()) {
      showToast(t("checkout.enterCode"), "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase(),
          userId: user?.id,
          orderAmount,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || "Invalid promo code", "error");
        return;
      }
      setDiscount(data.discountAmount);
      setApplied(true);
      onApply(data.discountAmount, data.promoCodeId);
      showToast(data.message || t("checkout.promoApplied"), "success");
    } catch {
      showToast("Failed to apply promo code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setApplied(false);
    setDiscount(0);
    onApply(0, "");
    showToast(t("checkout.removePromo"), "info");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h3 className="font-medium text-gray-900">{t("checkout.promoCode")}</h3>
      </div>
      {!applied ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t("checkout.enterCode")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? "..." : t("checkout.applyPromo")}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-900">{code}</p>
              <p className="text-xs text-green-700">
                -{formatCurrency(discount, "MNT")} {t("checkout.discountDeduction").toLowerCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {t("checkout.removePromo")}
          </button>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        <p>{t("checkout.promoCannotCombine")}</p>
        <p>{t("checkout.promoMinPurchase")}</p>
      </div>
    </div>
  );
}
