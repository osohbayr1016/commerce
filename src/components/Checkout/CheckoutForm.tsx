"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { QpayInvoiceResponse } from "@/lib/qpay";
import QpayDialog from "./QpayDialog";
import CheckoutInfoStep from "./CheckoutInfoStep";
import CheckoutPaymentStep from "./CheckoutPaymentStep";

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

      <div className="p-6">
        {currentStep === "info" ? (
          <CheckoutInfoStep
            form={form}
            isVerified={isVerified}
            showOtpInput={showOtpInput}
            verificationSent={verificationSent}
            otpCode={otpCode}
            error={error}
            onChange={handleChange}
            onVerifyEmail={handleVerifyEmail}
            onConfirmOtp={handleConfirmOtp}
            onSubmit={handleInfoSubmit}
            setOtpCode={setOtpCode}
          />
        ) : (
          <CheckoutPaymentStep
            items={items}
            paymentMethod={paymentMethod}
            hasEnoughCoins={hasEnoughCoins}
            userCoins={userCoins}
            requiredCoins={requiredCoins}
            submitting={submitting}
            error={error}
            onChangeMethod={setPaymentMethod}
            onSubmit={handlePaymentSubmit}
          />
        )}
      </div>
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
            const res = await fetch("/api/qpay/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: pendingOrderId }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data) {
              throw new Error(
                data.error ||
                  data.details ||
                  "Төлбөр шалгахад алдаа гарлаа. Дахин оролдоно уу.",
              );
            }

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
