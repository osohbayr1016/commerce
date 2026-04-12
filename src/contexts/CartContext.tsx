"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/useCartStore";

export type { CartProductType, CartItem } from "@/store/useCartStore";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const setUserId = useCartStore((state) => state.setUserId);

  // When the app initializes, rehydrate the Cart store on the client
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // Sync auth state into Zustand
  useEffect(() => {
    setUserId(user?.id || null);
  }, [user, setUserId]);

  return <>{children}</>;
}

// Ensure the old hook still provides exactly the same interface
export function useCart() {
  const store = useCartStore();

  const subtotal = useMemo(
    () =>
      (store.items || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [store.items]
  );
  const totalItems = useMemo(
    () => (store.items || []).reduce((sum, item) => sum + item.quantity, 0),
    [store.items]
  );

  return {
    items: store.items,
    subtotal,
    totalItems,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    syncing: store.syncing,
    isDrawerOpen: store.isDrawerOpen,
    openDrawer: store.openDrawer,
    closeDrawer: store.closeDrawer,
  };
}
