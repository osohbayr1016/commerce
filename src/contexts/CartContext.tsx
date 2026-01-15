"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  slug: string;
  brand?: string;
  imageColor?: string;
  brandColor?: string;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  addItem: (item: CartItem, quantity?: number) => { ok: boolean };
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const storageKey = user ? `cart:${user.id}` : null;

  useEffect(() => {
    if (!storageKey) {
      setItems([]);
      return;
    }
    const raw = localStorage.getItem(storageKey);
    setItems(raw ? JSON.parse(raw) : []);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = (item: CartItem, quantity = 1) => {
    if (!user) {
      return { ok: false };
    }
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (!existing) {
        return [...prev, { ...item, quantity }];
      }
      return prev.map((p) =>
        p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
      );
    });
    return { ok: true };
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalItems,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
