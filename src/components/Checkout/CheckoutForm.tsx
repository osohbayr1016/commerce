"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

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

type PaymentMethod = "qpay" | "bank" | "coins";

const COIN_PRICE_MNT = 1000; // 1 coin = 1000 MNT

export default function CheckoutForm({
  items,
  defaultValues,
  onSuccess,
}: CheckoutFormProps) {
  const { profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<"info" | "payment">("info");
  const [form, setForm] = useState<CheckoutFormValues>(defaultValues);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setIsVerified(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setIsVerified(false);
      setVerificationSent(false);
      setShowOtpInput(false);
      setOtpCode("");
    }
  }, [form.email, user]);

  // Calculate total in MNT
  const totalInMNT = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // Calculate required coins (round up)
  const requiredCoins = Math.ceil(totalInMNT / COIN_PRICE_MNT);
  const userCoins = profile?.coin_balance || 0;
  const hasEnoughCoins = userCoins >= requiredCoins;

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifyEmail = async () => {
    if (!form.email) return;
    setVerificationSent(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show OTP input even if there's an error, so user can try again
        setShowOtpInput(true);
        throw new Error(data.error || "И-мэйл илгээхэд алдаа гарлаа");
      }

      setShowOtpInput(true);
    } catch (err: any) {
      setError(
        err.message || "И-мэйл илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
      );
      // Keep OTP input visible so user can retry
      setShowOtpInput(true);
    } finally {
      setVerificationSent(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otpCode) return;
    setVerificationSent(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Баталгаажуулахад алдаа гарлаа");
      }

      setIsVerified(true);
      setShowOtpInput(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerificationSent(false);
    }
  };

  const handleInfoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isVerified) {
      setError("И-мэйл хаягаа баталгаажуулна уу");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) return;

    // Check if paying with coins and has enough
    if (paymentMethod === "coins" && !hasEnoughCoins) {
      setError(
        `Хангалтгүй монет. Таны үлдэгдэл: ${userCoins}, Шаардлагатай: ${requiredCoins}`,
      );
      return;
    }

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
          coinPayment:
            paymentMethod === "coins"
              ? {
                  coinsUsed: requiredCoins,
                  totalInMNT: totalInMNT,
                }
              : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Захиалга үүсгэхэд алдаа гарлаа");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Захиалга үүсгэхэд алдаа гарлаа");
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
                И-мэйл <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  required
                  readOnly={isVerified && !!user} // Only readOnly if logged in user
                />
                {!user && !isVerified && !showOtpInput && (
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={!form.email || verificationSent}
                    className="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {verificationSent ? "Илгээж байна..." : "Баталгаажуулах"}
                  </button>
                )}
                {isVerified && (
                  <span className="flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-green-500 text-white cursor-default">
                    Баталгаажсан
                  </span>
                )}
              </div>

              {showOtpInput && !isVerified && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="6 оронтой код оруулах"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      maxLength={6}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmOtp}
                      disabled={
                        !otpCode || otpCode.length < 6 || verificationSent
                      }
                      className="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {verificationSent ? "Шалгаж байна..." : "Баталгаажуулах"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {form.email} хаяг руу код илгээгдсэн
                    </p>
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={verificationSent}
                      className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Дахин илгээх
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

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

              {/* Coin Payment Option */}
              <div
                onClick={() => hasEnoughCoins && setPaymentMethod("coins")}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  !hasEnoughCoins
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
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
                    Монетоор төлөх
                  </div>
                  <div className="text-sm text-gray-500">
                    {hasEnoughCoins ? (
                      <>
                        Шаардлагатай: {requiredCoins} монет (Үлдэгдэл:{" "}
                        {userCoins})
                      </>
                    ) : (
                      <span className="text-red-500">
                        Хангалтгүй монет (Шаардлагатай: {requiredCoins},
                        Үлдэгдэл: {userCoins})
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
