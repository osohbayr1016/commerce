"use client";

import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/Cart/CartDrawer";

export default function ClientCartDrawer() {
  const { isDrawerOpen, closeDrawer } = useCart();

  return <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />;
}
