'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import AuthButton from './AuthButton';

type Step = 1 | 2 | 3;

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('И-мэйл хаяг оруулна уу');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "OTP илгээхэд алдаа гарлаа");
      }
      
      setStep(2);
      setSuccess('OTP имэйл рүүгээ илгээгдлээ. Шалгана уу.');
    } catch (err: any) {
      setError(err.message || 'OTP илгээхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 4) {
      setError('OTP код оруулна уу (4–6 орон)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "OTP буруу байна");
      }
      
      setStep(3);
      setSuccess('');
    } catch (err: any) {
      setError(err.message || 'OTP буруу байна. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Нууц үг 6-аас дээш тэмдэгт байх ёстой');
      return;
    }
    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Нууц үг солиход алдаа гарлаа");
      }
      
      setSuccess('Нууц үг амжилттай солигдлоо. Нэвтэрч болно.');
      // Optional: Redirect to login after a delay
    } catch (err: any) {
      setError(err.message || 'Нууц үг солиход алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError('');
    setSuccess('');
    if (step === 2) {
      setStep(1);
      setOtp('');
    } else if (step === 3) {
      setStep(2);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Нууц үг сэргээх</h1>
        <p className="text-gray-600 text-sm">
          {step === 1 && 'Бүртгэлтэй и-мэйлээ оруулна уу'}
          {step === 2 && 'Имэйл рүү илгээсэн OTP оруулна уу'}
          {step === 3 && 'Шинэ нууц үгээ оруулна уу'}
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${step >= s ? 'bg-gray-900' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">И-мэйл</label>
            <AuthInput
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <AuthButton type="submit" loading={loading} disabled={loading}>
            OTP илгээх
          </AuthButton>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OTP код</label>
            <AuthInput
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoComplete="one-time-code"
            />
            <p className="mt-1 text-xs text-gray-500">{email} рүү илгээсэн</p>
          </div>
          <AuthButton type="submit" loading={loading} disabled={loading}>
            Шалгах
          </AuthButton>
          <button
            type="button"
            onClick={goBack}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Буцах
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Шинэ нууц үг</label>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Нууц үг давтах</label>
            <PasswordInput
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <AuthButton type="submit" loading={loading} disabled={loading}>
            Нууц үг солих
          </AuthButton>
          <button
            type="button"
            onClick={goBack}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Буцах
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        <Link href="/auth/login" className="text-gray-900 font-medium hover:underline">
          ← Нэвтрэх хуудас руу буцах
        </Link>
      </p>
    </div>
  );
}
