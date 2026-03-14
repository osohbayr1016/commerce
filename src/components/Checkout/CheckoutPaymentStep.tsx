"use client";

import { CartItem } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

type PaymentMethod = "qpay" | "bank" | "coins";

interface CheckoutPaymentStepProps {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  hasEnoughCoins: boolean;
  userCoins: number;
  requiredCoins: number;
  submitting: boolean;
  error: string;
  onChangeMethod: (method: PaymentMethod) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function CheckoutPaymentStep({
  items,
  paymentMethod,
  hasEnoughCoins,
  userCoins,
  requiredCoins,
  submitting,
  error,
  onChangeMethod,
  onSubmit,
}: CheckoutPaymentStepProps) {
  const { t } = useLanguage();
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">Secure payment. Your data is protected.</p>
      <div className="space-y-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onChangeMethod("qpay")}
          onKeyDown={(e) => e.key === "Enter" && onChangeMethod("qpay")}
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            paymentMethod === "qpay"
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-900">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">QPay</div>
            <div className="text-sm text-gray-500">
              {t("checkout.qpayDescription")}
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "qpay"
                ? "border-gray-900 bg-gray-900"
                : "border-gray-300"
            }`}
          >
            {paymentMethod === "qpay" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        <div
          onClick={() => onChangeMethod("bank")}
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            paymentMethod === "bank"
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {t("checkout.bankTransfer")}
            </div>
            <div className="text-sm text-gray-500">
              {t("checkout.bankTransferDescription")}
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "bank"
                ? "border-gray-900 bg-gray-900"
                : "border-gray-300"
            }`}
          >
            {paymentMethod === "bank" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        <div
          onClick={() => hasEnoughCoins && onChangeMethod("coins")}
          className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
            !hasEnoughCoins ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${
            paymentMethod === "coins"
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {t("checkout.payWithCoins")}
            </div>
            <div className="text-sm text-gray-500">
              {hasEnoughCoins ? (
                t("checkout.coinsRequired", {
                  required: requiredCoins,
                  balance: userCoins,
                })
              ) : (
                <span className="text-red-500">
                  {t("checkout.coinsInsufficient", {
                    required: requiredCoins,
                    balance: userCoins,
                  })}
                </span>
              )}
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "coins"
                ? "border-yellow-500 bg-yellow-500"
                : "border-gray-300"
            }`}
          >
            {paymentMethod === "coins" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || items.length === 0}
        className="w-full rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? t("checkout.submitting") : t("checkout.submitPayment")}
      </button>
    </form>
  );
}

