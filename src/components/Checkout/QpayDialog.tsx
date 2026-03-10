"use client";

import type { QpayInvoiceResponse } from "@/lib/qpay";

interface QpayDialogProps {
  open: boolean;
  data: QpayInvoiceResponse | null;
  onClose: () => void;
  onPaid: () => void;
  checking?: boolean;
  errorMessage?: string;
}

export default function QpayDialog({
  open,
  data,
  onClose,
  onPaid,
  checking = false,
  errorMessage,
}: QpayDialogProps) {
  if (!open || !data) return null;

  const appStyles: Record<
    string,
    { badge: string; symbol: string }
  > = {
    "qpay wallet": { badge: "bg-blue-900 text-white", symbol: "Q" },
    "khan bank": { badge: "bg-green-700 text-white", symbol: "KH" },
    "state bank": { badge: "bg-sky-700 text-white", symbol: "ST" },
    "xac bank": { badge: "bg-indigo-700 text-white", symbol: "XA" },
    "trade and development bank": {
      badge: "bg-blue-700 text-white",
      symbol: "TDB",
    },
    "national investment bank": {
      badge: "bg-emerald-700 text-white",
      symbol: "NI",
    },
    "capitron bank": { badge: "bg-purple-700 text-white", symbol: "CA" },
    "bogd bank": { badge: "bg-lime-700 text-white", symbol: "BO" },
    "chinggis khaan bank": {
      badge: "bg-amber-700 text-white",
      symbol: "CH",
    },
    "most money": { badge: "bg-orange-600 text-white", symbol: "M" },
    "social pay": { badge: "bg-pink-600 text-white", symbol: "SP" },
    "ard app": { badge: "bg-red-600 text-white", symbol: "AR" },
    "happy pay": { badge: "bg-yellow-500 text-white", symbol: "HP" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">QPay төлбөр</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Доорх QR кодыг QPay эсвэл банкны апп-аар уншуулж төлбөрөө хийнэ үү.
          </p>
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${data.qr_image}`}
              alt="QPay QR"
              className="h-64 w-64 rounded-lg border border-gray-200 bg-white object-contain p-2"
            />
          </div>
          {data.urls && data.urls.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                Эсвэл доорх апп-уудын товчийг дарж шууд төлнө үү:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.urls.map((u, idx) => {
                  if (!u.link) return null;
                  const displayName = u.name || u.description || "App";
                  const key = displayName.toLowerCase();
                  const style = appStyles[key] || {
                    badge: "bg-gray-200 text-gray-800",
                    symbol: displayName.charAt(0).toUpperCase(),
                  };
                  return (
                    <button
                      key={`${u.link}-${idx}`}
                      type="button"
                      onClick={() => {
                        window.location.href = u.link as string;
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-semibold ${style.badge}`}
                      >
                        {style.symbol}
                      </span>
                      <span>{displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMessage}
            </p>
          )}
          <button
            type="button"
            onClick={onPaid}
            disabled={checking}
            className="w-full rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {checking ? "Төлбөр шалгаж байна..." : "Төлбөр хийж дууссан"}
          </button>
        </div>
      </div>
    </div>
  );
}

