"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/contexts/CartContext";

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  defaultValues: CheckoutFormValues;
  onSuccess: () => void;
}

type PaymentMethod = "qpay" | "bank";

export default function CheckoutForm({
  items,
  defaultValues,
  onSuccess,
}: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState<"info" | "payment">("info");
  const [form, setForm] = useState<CheckoutFormValues>(defaultValues);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: form,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Захиалга үүсгэхэд алдаа гарлаа");
      }

      onSuccess();
    } catch (err) {
      setError("Захиалга үүсгэхэд алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setCurrentStep("info")}
          className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
            currentStep === "info"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Мэдээлэл
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep("payment")}
          className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
            currentStep === "payment"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Төлбөр төлөх
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentStep === "info" ? (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нэр <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Зочин#HG01"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Утас <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Утас *"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нэмэлт мэдээлэл
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Нэмэлт мэдээлэл"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                what3words хаяг
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="///далай.бармат.юкинсэх т.м"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Үргэлжлүүлэх
            </button>
          </form>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="space-y-3">
              {/* QPay Option */}
              <div
                onClick={() => setPaymentMethod("qpay")}
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
                    Төлбөрөө QPay хэтэвчээр ашиглан төлөх сонголт
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

              {/* Bank Transfer Option */}
              <div
                onClick={() => setPaymentMethod("bank")}
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
                    Дансаар шилжүүлэх
                  </div>
                  <div className="text-sm text-gray-500">
                    Дансаар шинэтгэл шилжүүлэг хийх
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
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Илгээж байна..." : "Төлбөр төлөх"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
