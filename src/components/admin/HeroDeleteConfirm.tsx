"use client";

interface HeroDeleteConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function HeroDeleteConfirm({
  isOpen,
  title,
  message,
  confirmText = "Remove",
  cancelText = "Cancel",
  isDeleting = false,
  onConfirm,
  onCancel,
}: HeroDeleteConfirmProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-delete-title"
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="fixed inset-0 bg-gray-600/75"
          aria-hidden="true"
          onClick={isDeleting ? undefined : onCancel}
        />
        <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h2 id="hero-delete-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          </div>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Removing…" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
