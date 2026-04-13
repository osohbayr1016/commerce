"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  fetchCartFromServer,
  addItemToServerCart,
  updateItemInServerCart,
  removeItemFromServerCart,
  syncCartToServer,
} from "@/lib/cart";

export type CartProductType = "shoes" | "clothes" | "beauty" | "other";

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
  images?: string[];
  size?: number;
  color?: string;
  productType?: CartProductType;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  syncing: boolean;
  userId: string | null;

  // Actions
  setUserId: (userId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  addItem: (
    item: CartItem,
    quantity?: number
  ) => Promise<{ ok: boolean; error?: string }>;
  updateQuantity: (id: string, quantity: number, size?: number) => Promise<{ ok: boolean; error?: string } | void>;
  removeItem: (id: string, size?: number) => void;
  clearCart: () => void;
  
  // Internal sync helpers
  syncFromServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      syncing: false,
      userId: null,

      setUserId: (userId) => {
        const prevId = get().userId;
        set({ userId });
        if (userId && prevId !== userId) {
          get().syncFromServer();
        }
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      syncFromServer: async () => {
        const { userId, items: localItems } = get();
        if (!userId) return;

        set({ syncing: true });
        try {
          const serverItems = await fetchCartFromServer().catch(() => []);
          const mergedItems = [...(Array.isArray(serverItems) ? serverItems : [])];
          
          let needsSync = false;
          localItems.forEach((localItem) => {
            const exists = mergedItems.find(
              (item) => item.id === localItem.id && item.size === localItem.size
            );
            if (!exists) {
              mergedItems.push(localItem);
              needsSync = true;
            }
          });

          set({ items: mergedItems });

          if (needsSync) {
            await syncCartToServer(mergedItems);
          }
        } catch (error) {
          console.error("Cart sync failed", error);
        } finally {
          set({ syncing: false });
        }
      },

      addItem: async (item, quantity = 1) => {
        const { userId, items } = get();
        
        try {
          const stockUrl =
            item.size != null
              ? `/api/products/${item.id}/variant-stock?size=${item.size}`
              : `/api/products/${item.id}/stock`;
          const response = await fetch(stockUrl);
          
          if (response.ok) {
            const stockData = await response.json();
            const currentQuantity =
              items.find((i) => i.id === item.id && i.size === item.size)
                ?.quantity || 0;
            const requestedQuantity = currentQuantity + quantity;

            if (stockData.stock < requestedQuantity) {
              return {
                ok: false,
                error:
                  stockData.stock === 0
                    ? "Бэлэн бараа байхгүй"
                    : `Зөвхөн ${stockData.stock} ширхэг үлдсэн`,
              };
            }
          }
        } catch (err) {}

        set((state) => {
          const existing = state.items.find(
            (p) => p.id === item.id && p.size === item.size
          );
          const next = existing
            ? state.items.map((p) =>
                p.id === item.id && p.size === item.size
                  ? { ...p, quantity: p.quantity + quantity }
                  : p
              )
            : [...state.items, { ...item, quantity }];
          return { items: next, isDrawerOpen: true };
        });

        if (userId) {
          addItemToServerCart(item.id, quantity, item.size).catch(() => {});
        }

        return { ok: true };
      },

      updateQuantity: async (id, quantity, size) => {
        const { items, userId } = get();
        const finalQuantity = Math.max(1, quantity);
        const item = items.find((i) => i.id === id && i.size === size);

        try {
          const stockUrl =
            item?.size != null
              ? `/api/products/${id}/variant-stock?size=${item.size}`
              : `/api/products/${id}/stock`;
          const response = await fetch(stockUrl);
          
          if (response.ok) {
            const stockData = await response.json();
            if (stockData.stock < finalQuantity) {
              const adjustedQuantity = Math.min(stockData.stock, finalQuantity);
              set((state) => ({
                items: state.items.map((i) =>
                  i.id === id && i.size === size ? { ...i, quantity: adjustedQuantity } : i
                ),
              }));
              if (item && userId) {
                updateItemInServerCart(id, adjustedQuantity, item.size).catch(() => {});
              }
              return { ok: false, error: "Барааны үлдэгдэл хүрэлцэхгүй байна" };
            }
          }
        } catch (err) {}

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity: finalQuantity } : i
          ),
        }));

        if (item && userId) {
          updateItemInServerCart(id, finalQuantity, item.size).catch(() => {});
        }
      },

      removeItem: async (id, size) => {
        const { items, userId } = get();
        const item = items.find((i) => i.id === id && i.size === size);

        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && (size === undefined || i.size === size))
          ),
        }));

        if (item && userId) {
          removeItemFromServerCart(id, item.size).catch(() => {});
        }
      },

      clearCart: async () => {
        const { items, userId } = get();
        
        if (userId) {
          items.forEach((item) => {
            removeItemFromServerCart(item.id, item.size).catch(() => {});
          });
        }
        
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true, 
    }
  )
);
