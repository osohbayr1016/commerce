"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AuthInput from "@/components/Auth/AuthInput";
import PasswordInput from "@/components/Auth/PasswordInput";
import AuthButton from "@/components/Auth/AuthButton";
import { getErrorMessage } from "@/types";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const referralCodeParam = searchParams?.get("ref");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [promoCode, setPromoCode] = useState(referralCodeParam || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithFacebook, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }

    if (password.length < 6) {
      setError("Нууц үг 6-аас дээш тэмдэгт байх ёстой");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("И-мэйл хаяг буруу байна");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      setError("Утасны дугаар буруу байна");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, phone, password, fullName);

      // If promo code is provided, validate and apply it
      if (promoCode.trim()) {
        try {
          const promoResponse = await fetch("/api/referral/validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ promoCode: promoCode.trim() }),
          });

          if (!promoResponse.ok) {
            const promoData = await promoResponse.json();
            console.warn("Promo code validation failed:", promoData.error);
            // Don't fail signup if promo code is invalid
          }
        } catch (promoErr) {
          console.warn("Failed to apply promo code:", promoErr);
          // Don't fail signup if promo code application fails
        }
      }

      setSuccess("Бүртгэл амжилттай! Нэвтэрч байна...");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err) || "Алдаа гарлаа. Дахин оролдоно уу.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      const isProviderDisabled =
        typeof msg === "string" &&
        (msg.includes("provider is not enabled") ||
          msg.includes("Unsupported provider"));
      setError(
        isProviderDisabled
          ? "Google нэвтрэх идэвхгүй байна. Supabase Dashboard → Authentication → Providers → Google идэвхжүүлнэ. Заавар: ENABLE_GOOGLE_LOGIN.md"
          : msg || "Google нэвтрэх үед алдаа гарлаа",
      );
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithFacebook();
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      const isProviderDisabled =
        typeof msg === "string" &&
        (msg.includes("provider is not enabled") ||
          msg.includes("Unsupported provider"));
      setError(
        isProviderDisabled
          ? "Facebook нэвтрэх идэвхгүй байна. Supabase Dashboard → Authentication → Providers → Facebook идэвхжүүлнэ."
          : msg || "Facebook нэвтрэх үед алдаа гарлаа",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Бүртгүүлэх</h1>
          <p className="text-gray-600">E-commerce</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нэр
            </label>
            <AuthInput
              type="text"
              placeholder="Нэрээ оруулна уу"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              И-мэйл хаяг
            </label>
            <AuthInput
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Утасны дугаар
            </label>
            <AuthInput
              type="tel"
              placeholder="99999999 эсвэл +976 9999 9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
            <p className="mt-1 text-xs text-gray-500">
              И-мэйл эсвэл утасны дугаараар нэвтрэх боломжтой
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нууц үг
            </label>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нууц үг давтах
            </label>
            <PasswordInput
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code (заавал биш)
            </label>
            <AuthInput
              type="text"
              placeholder="FRIEND123"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-gray-500">
              Найзын promo код байвал оруулна уу
            </p>
          </div>

          <AuthButton type="submit" loading={loading} disabled={loading}>
            Бүртгүүлэх
          </AuthButton>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">эсвэл</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <AuthButton
            variant="secondary"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google-ээр нэвтрэх
          </AuthButton>

          <AuthButton
            variant="secondary"
            onClick={handleFacebookSignIn}
            disabled={loading}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook-ээр нэвтрэх
          </AuthButton>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Та бүртгэлтэй юу?{" "}
          <Link
            href="/auth/login"
            className="text-gray-900 font-medium hover:underline"
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}
