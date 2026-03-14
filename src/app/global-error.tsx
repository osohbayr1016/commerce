"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import("@sentry/nextjs").then((S) => S.captureException(error));
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            style={{
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              backgroundColor: "white",
              borderRadius: 16,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              padding: 32,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 16px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 28 }}>⚠️</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 }}>
              Something went wrong
            </h1>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>
              We're sorry. Please try again or go back to the home page.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 24px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  color: "#374151",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
