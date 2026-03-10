"use client";

import type { CheckoutFormValues } from "./CheckoutTypes";

interface CheckoutInfoStepProps {
  form: CheckoutFormValues;
  isVerified: boolean;
  showOtpInput: boolean;
  verificationSent: boolean;
  otpCode: string;
  error: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onVerifyEmail: () => void;
  onConfirmOtp: () => void;
  onSubmit: (event: React.FormEvent) => void;
  setOtpCode: (code: string) => void;
}

export default function CheckoutInfoStep({
  form,
  isVerified,
  showOtpInput,
  verificationSent,
  otpCode,
  error,
  onChange,
  onVerifyEmail,
  onConfirmOtp,
  onSubmit,
  setOtpCode,
}: CheckoutInfoStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Нэр <span className="text-red-500">*</span>
        </label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
            placeholder="name@example.com"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
            readOnly={isVerified}
          />
          {!isVerified && !showOtpInput && (
            <button
              type="button"
              onClick={onVerifyEmail}
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
                onClick={onConfirmOtp}
                disabled={!otpCode || otpCode.length < 6 || verificationSent}
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
                onClick={onVerifyEmail}
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
          onChange={onChange}
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
          onChange={onChange}
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
  );
}

