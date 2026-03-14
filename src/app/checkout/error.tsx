"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Төлбөрт алдаа гарлаа
          </h1>
          <p className="text-gray-600 mb-6">
            Уучлаарай, төлбөр эсвэл захиалга үед алдаа гарлаа. Дахин оролдоно уу эсвэл сагс руу буцаж очно уу.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={reset}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Дахин оролдох
            </button>
            <Link
              href="/cart"
              className="block w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Сагс руу буцах
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 text-gray-600 hover:text-gray-900 text-sm"
            >
              Нүүр хуудас
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
