"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CheckoutClient />
    </ErrorBoundary>
  );
}
