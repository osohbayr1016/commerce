"use client";

import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/Cart/CartDrawer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ClientCartDrawer() {
  const { isDrawerOpen, closeDrawer } = useCart();

  return (
    <ErrorBoundary>
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </ErrorBoundary>
  );
}
