"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { QpayInvoiceResponse } from "@/lib/qpay";
import { retryWithBackoff } from "@/lib/errors";
import QpayDialog from "./QpayDialog";

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
  onSuccess: (orderId: string, paymentMethod: PaymentMethod) => void;
}

type PaymentMethod = "qpay" | "coins";

const COIN_PRICE_MNT = 1000; // 1 coin = 1000 MNT

export default function CheckoutForm({
  items,
  defaultValues,
  onSuccess,
}: CheckoutFormProps) {
  const { profile, user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<CheckoutFormValues>(defaultValues);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [qpayData, setQpayData] = useState<QpayInvoiceResponse | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [showQpayDialog, setShowQpayDialog] = useState(false);
  const [qpayChecking, setQpayChecking] = useState(false);

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
        setShowOtpInput(true);
        throw new Error(data.error || "И-мэйл илгээхэд алдаа гарлаа");
      }

      setShowOtpInput(true);
    } catch (err: any) {
      setError(
        err.message || "И-мэйл илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
      );
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

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) return;

    if (!isVerified) {
      setError("Урагшлахаас өмнө и-мэйл хаягаа баталгаажуулна уу.");
      const emailField = document.getElementsByName("email")[0];
      if (emailField) {
        emailField.scrollIntoView({ behavior: "smooth", block: "center" });
        (emailField as HTMLInputElement).focus();
      }
      return;
    }

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
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || data.details || "Захиалга үүсгэхэд алдаа гарлаа",
        );
      }

      const data = await response.json().catch(() => ({}));
      const orderId = data.orderId as string | undefined;

      if (paymentMethod === "qpay" && data.qpay) {
        setQpayData(data.qpay as QpayInvoiceResponse);
        setPendingOrderId(orderId ?? null);
        setError("");
        setShowQpayDialog(true);
        return;
      }

      if (orderId) {
        onSuccess(orderId, paymentMethod);
      } else {
        onSuccess("", paymentMethod);
      }
    } catch (err: any) {
      setError(err.message || "Захиалга үүсгэхэд алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        
        {/* SECTION 1: CUSTOMER DETAILS */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">1</span>
              Холбоо барих мэдээлэл
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Захиалгын статус болон хүргэлтийн мэдээллийг илгээхэд ашиглагдана.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                Хүлээн авагчийн нэр <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Таны нэр"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-gray-50/30"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                Холбоо барих утас <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Утасны дугаар"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-gray-50/30"
                required
              />
            </div>
          </div>

          {/* Email Verification Row */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              И-мэйл хаяг <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-gray-50/30 disabled:bg-gray-100 disabled:text-gray-500"
                required
                readOnly={isVerified}
                disabled={isVerified}
              />
              {!isVerified && !showOtpInput && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={!form.email || verificationSent}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {verificationSent ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Илгээж байна...
                    </>
                  ) : (
                    "Код авах"
                  )}
                </button>
              )}
              {isVerified && (
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200/50 self-start sm:self-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Баталгаажсан
                </div>
              )}
            </div>

            {showOtpInput && !isVerified && (
              <div className="mt-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/20 space-y-3">
                <p className="text-xs text-blue-800 font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Таны {form.email} хаяг руу 6 оронтой баталгаажуулах код илгээлээ.
                </p>
                <div className="flex gap-2">
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-bold tracking-widest text-gray-900 placeholder:text-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-white"
                    maxLength={6}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmOtp}
                    disabled={!otpCode || otpCode.length < 6 || verificationSent}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {verificationSent ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Шалгаж байна...
                      </>
                    ) : (
                      "Баталгаажуулах"
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-400">Код ирээгүй юу?</span>
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={verificationSent}
                    className="text-blue-600 font-bold hover:text-blue-800 transition-colors disabled:opacity-50"
                  >
                    Дахин илгээх
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: DELIVERY ADDRESS */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">2</span>
              Хүргэлтийн хаяг
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Барааг түргэн шуурхай, алдаагүй хүргэхэд туслах хамгийн найдвартай арга.
            </p>
          </div>

          {/* Google Maps Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                Google Maps Байршлын холбоос <span className="text-red-500">*</span>
              </label>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
              >
                Газрын зураг нээх
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-gray-50/30"
              required
            />
            
            {/* Premium Informational Box */}
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl mt-3 text-xs text-amber-900/90 leading-relaxed flex gap-3">
              <span className="text-lg leading-none">📍</span>
              <p>
                Хүргэлтийн хаягийг <b>Google Maps холбоос</b> хэлбэрээр оруулах нь хүргэлт илүү хурдан, ямар нэгэн алдаагүй очих хамгийн найдвартай шийдэл юм. Та Google Maps дээр өөрийн байршил дээр удаан дарж <b>Share (Хуваалцах)</b> товчийг дарж холбоосоо хуулж авна уу.
              </p>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Нэмэлт тэмдэглэл, заавар
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Жишээ нь: Орцны код 1234, Хүргэхээс өмнө заавал залгаарай"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-gray-50/30"
              rows={3}
            />
          </div>
        </div>

        {/* SECTION 3: PAYMENT METHOD */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">3</span>
              Төлбөр төлөх хэрэгсэл
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Төлбөр хийх хэрэгслээ сонгон хамгаалалттай сувгаар төлнө үү.
            </p>
          </div>

          <div className="space-y-4">
            {/* QPAY METHOD CARD */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setPaymentMethod("qpay")}
              onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("qpay")}
              className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative ${
                paymentMethod === "qpay"
                  ? "border-black bg-gray-50/50 shadow-sm"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/20"
              }`}
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
                paymentMethod === "qpay" ? "bg-blue-600 shadow-md shadow-blue-600/10" : "bg-gray-100"
              }`}>
                <span className={`font-black text-2xl tracking-tighter ${
                  paymentMethod === "qpay" ? "text-white" : "text-gray-400"
                }`}>Q</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 flex items-center gap-2 text-base">
                  QPay ашиглах
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Шуурхай
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {t("checkout.qpayDescription") || "Бүх банкны апп-аар QR код уншуулан шууд төлөх боломжтой."}
                </p>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  paymentMethod === "qpay"
                    ? "border-black bg-black scale-105"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {paymentMethod === "qpay" && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>

            {/* COINS METHOD CARD */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => hasEnoughCoins && setPaymentMethod("coins")}
              onKeyDown={(e) => e.key === "Enter" && hasEnoughCoins && setPaymentMethod("coins")}
              className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 relative ${
                !hasEnoughCoins 
                  ? "opacity-60 cursor-not-allowed border-gray-100 bg-gray-50/20" 
                  : "cursor-pointer"
              } ${
                paymentMethod === "coins"
                  ? "border-amber-500 bg-amber-50/10 shadow-sm"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/20"
              }`}
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
                paymentMethod === "coins" ? "bg-amber-500 shadow-md shadow-amber-500/10" : "bg-gray-100"
              }`}>
                <svg
                  className={`w-7 h-7 ${paymentMethod === "coins" ? "text-white" : "text-gray-400"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 flex items-center gap-2 text-base">
                  {t("checkout.payWithCoins") || "Монет (Loyalty) ашиглах"}
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Монет
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {hasEnoughCoins ? (
                    <div className="flex items-center gap-1.5 text-green-700 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Ашиглах боломжтой (Тэнцэл: {userCoins} монет)
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Монет хүрэлцэхгүй (Тэнцэл: {userCoins} / Шаардлагатай: {requiredCoins} монет)
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  paymentMethod === "coins"
                    ? "border-amber-500 bg-amber-500 scale-105"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {paymentMethod === "coins" && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {paymentMethod === "coins" && hasEnoughCoins && (
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/20 text-xs text-amber-800 space-y-1">
              <p className="font-bold text-amber-900">💡 Монетоор төлөх заавар:</p>
              <p>
                Захиалгыг баталгаажуулснаар таны үлдэгдлээс <b>{requiredCoins}</b> монет хасагдах болно. 1 монет = 1000 ₮-тэй тэнцэнэ.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600 font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {/* ORDER SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="w-full rounded-xl bg-black px-6 py-4.5 text-white font-bold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs shadow-md shadow-gray-900/10 hover:shadow-lg flex items-center justify-center gap-2 active:translate-y-px"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Захиалга үүсгэж байна...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t("checkout.submitPayment") || "Захиалга баталгаажуулах"}
            </>
          )}
        </button>
      </form>

      <QpayDialog
        open={showQpayDialog}
        data={qpayData}
        onClose={() => setShowQpayDialog(false)}
        checking={qpayChecking}
        errorMessage={error}
        onPaid={async () => {
          if (!pendingOrderId) {
            setError("Захиалгын ID олдсонгүй. Дахин оролдоно уу.");
            return;
          }
          setQpayChecking(true);
          setError("");
          try {
            const data = await retryWithBackoff(
              async () => {
                const res = await fetch("/api/qpay/confirm", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: pendingOrderId }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  throw new Error(
                    data.error ||
                      data.details ||
                      "Төлбөр шалгахад алдаа гарлаа. Дахин оролдоно уу."
                  );
                }
                return data;
              },
              3,
              1000
            );

            if (data.status === "paid") {
              setShowQpayDialog(false);
              onSuccess(pendingOrderId, "qpay");
            } else {
              setError(
                "Төлбөр төлөгдөөгүй байна. Түр хүлээгээд дахин шалгана уу.",
              );
            }
          } catch (err: any) {
            setError(
              err.message ||
                "Төлбөр шалгахад алдаа гарлаа. Дахин оролдоно уу.",
            );
          } finally {
            setQpayChecking(false);
          }
        }}
      />
    </div>
  );
}
