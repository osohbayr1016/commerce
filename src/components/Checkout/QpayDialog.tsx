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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm pb-3">
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
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {data.urls.map((u, idx) => {
                  if (!u.link) return null;
                  const displayName = u.name || u.description || "App";
                  const urlAny = u as any;
                  const logoSrc =
                    urlAny.logo ||
                    urlAny.logo_url ||
                    urlAny.image ||
                    urlAny.icon ||
                    "https://upload.wikimedia.org/wikipedia/commons/3/3a/QPay_logo.svg";
                  return (
                    <button
                      key={`${u.link}-${idx}`}
                      type="button"
                      onClick={() => {
                        window.location.href = u.link as string;
                      }}
                      className="flex flex-col items-center gap-1 focus:outline-none"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <img
                          src={logoSrc}
                          alt={displayName}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <span className="w-full truncate text-[0.65rem] text-center text-gray-700">
                        {displayName}
                      </span>
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

