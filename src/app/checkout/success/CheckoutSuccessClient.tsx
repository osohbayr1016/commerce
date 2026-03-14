"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { retryWithBackoff } from "@/lib/errors";

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const method = searchParams.get("method") ?? "";

  const isBankTransfer = method === "bank";
  const isQpay = method === "qpay";
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      if (!orderId || !isQpay) return;
      setChecking(true);
      setError("");
      try {
        const data = await retryWithBackoff(
          async () => {
            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              throw new Error(
                data.error ||
                  data.details ||
                  "Төлбөрийн төлөв уншихад алдаа гарлаа."
              );
            }
            return data;
          },
          3,
          1000
        );
        setPaymentStatus(data.payment_status || null);
      } catch (err: any) {
        setError(
          err.message || "Төлбөрийн төлөв уншихад алдаа гарлаа.",
        );
      } finally {
        setChecking(false);
      }
    };
    fetchStatus();
  }, [orderId, isQpay]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <BackButton />
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {isQpay && paymentStatus !== "paid"
            ? "Захиалга бүртгэгдлээ"
            : "Захиалга амжилттай боллоо"}
        </h1>
        {orderId && (
          <p className="text-gray-600 text-sm mb-4">
            Захиалгын дугаар:{" "}
            <span className="font-mono font-medium">
              {orderId.slice(0, 8)}...
            </span>
          </p>
        )}

        {isQpay && paymentStatus !== "paid" && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-left border border-yellow-200">
            <h2 className="font-semibold text-gray-900 mb-2">
              QPay төлбөрийн төлөв
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              Таны захиалга бүртгэгдсэн боловч QPay төлбөр шалгагдаагүй
              байна. Төлбөрөө хийсний дараа доорх товчийг дарж төлөвийг
              шалгана уу.
            </p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={async () => {
                if (!orderId) return;
                setChecking(true);
                setError("");
                try {
                  const data = await retryWithBackoff(
                    async () => {
                      const res = await fetch("/api/qpay/confirm", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        throw new Error(
                          data.error ||
                            data.details ||
                            "Төлбөр шалгахад алдаа гарлаа."
                        );
                      }
                      return data;
                    },
                    3,
                    1000
                  );
                  if (data.status === "paid") {
                    setPaymentStatus("paid");
                  } else {
                    setError(
                      "Төлбөр төлөгдөөгүй байна. Түр хүлээгээд дахин шалгана уу."
                    );
                  }
                } catch (err: any) {
                  setError(
                    err.message || "Төлбөр шалгахад алдаа гарлаа."
                  );
                } finally {
                  setChecking(false);
                }
              }}
              disabled={checking}
              className="mt-2 inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking ? "Шалгаж байна..." : "Төлбөрийн төлөв шалгах"}
            </button>
          </div>
        )}

        {isBankTransfer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">
              Дансаар шилжүүлэх заавар
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Захиалгаа баталгаажуулахын тулд доорх данс руу төлбөрөө шилжүүлнэ
              үү. Гүйлгээний утгад захиалгын дугаараа бичнэ үү.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Банк:</span> [Банкны нэр]
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Данс:</span> [Дансны дугаар]
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Хүлээн авагч:</span> [Нэр]
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Төлбөр хүлээн авсны дараа захиалгаа баталгаажуулна.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <Link
            href="/profile?tab=orders"
            className="rounded-lg bg-gray-900 px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Миний захиалга
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Үргэлжлүүлэх дэлгүүр
          </Link>
        </div>
      </div>
    </div>
  );
}
