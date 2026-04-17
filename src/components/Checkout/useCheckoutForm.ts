"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { QpayInvoiceResponse } from "@/lib/qpay";
import type {
  CheckoutFormProps,
  CheckoutFormValues,
  PaymentMethod,
} from "./CheckoutTypes";

const COIN_PRICE_MNT = 1000;

export function useCheckoutForm({
  items,
  defaultValues,
  onSuccess,
}: CheckoutFormProps) {
  const { profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<"info" | "payment">("info");
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

  useEffect(() => {
    if (user?.email) setIsVerified(true);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setIsVerified(false);
      setVerificationSent(false);
      setShowOtpInput(false);
      setOtpCode("");
    }
  }, [form.email, user]);

  const totalInMNT = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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
              ? { coinsUsed: requiredCoins, totalInMNT }
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
        setShowQpayDialog(true);
        return;
      }

      onSuccess(orderId ?? "", paymentMethod);
    } catch (err: any) {
      setError(err.message || "Захиалга үүсгэхэд алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQpayPaid = () => {
    setShowQpayDialog(false);
    onSuccess(pendingOrderId ?? "", "qpay");
  };

  return {
    currentStep,
    setCurrentStep,
    form,
    paymentMethod,
    setPaymentMethod,
    submitting,
    error,
    isVerified,
    verificationSent,
    otpCode,
    setOtpCode,
    showOtpInput,
    qpayData,
    showQpayDialog,
    hasEnoughCoins,
    userCoins,
    requiredCoins,
    handleChange,
    handleVerifyEmail,
    handleConfirmOtp,
    handleInfoSubmit,
    handlePaymentSubmit,
    handleQpayPaid,
    closeQpayDialog: () => setShowQpayDialog(false),
  };
}

