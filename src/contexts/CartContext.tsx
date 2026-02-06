"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCartFromServer,
  addItemToServerCart,
  updateItemInServerCart,
  removeItemFromServerCart,
  syncCartToServer,
} from "@/lib/cart";

export type CartProductType = "shoes" | "clothes" | "beauty";

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
  productType?: CartProductType;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  addItem: (
    item: CartItem,
    quantity?: number,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => void;
  clearCart: () => void;
  syncing: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const storageKey = user ? `cart:${user.id}` : "cart:guest";

  useEffect(() => {
    if (!storageKey) {
      setItems([]);
      return;
    }

    const loadCart = async () => {
      setSyncing(true);
      try {
        let serverItems: CartItem[] = [];
        if (user) {
          try {
            serverItems = await fetchCartFromServer();
          } catch (e) {
            console.error("Failed to fetch server cart", e);
          }
        }

        const raw = localStorage.getItem(storageKey);
        let localItems: CartItem[] = [];
        try {
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) {
            localItems = parsed;
          }
        } catch (e) {
          console.error("Error parsing cart from localStorage", e);
          localItems = [];
        }

        // If user is logged in, merge. If guest, just use local.
        const mergedItems = user
          ? [...(Array.isArray(serverItems) ? serverItems : [])]
          : [...localItems];

        if (user) {
          localItems.forEach((localItem: CartItem) => {
            const exists = mergedItems.find(
              (item) =>
                item.id === localItem.id && item.size === localItem.size,
            );
            if (!exists) {
              mergedItems.push(localItem);
            }
          });
        }

        setItems(mergedItems);
        localStorage.setItem(storageKey, JSON.stringify(mergedItems));

        if (
          user &&
          localItems.length > 0 &&
          serverItems.length !== mergedItems.length
        ) {
          await syncCartToServer(mergedItems);
        }
      } catch (error) {
        const raw = localStorage.getItem(storageKey);
        setItems(raw ? JSON.parse(raw) : []);
      } finally {
        setSyncing(false);
        isInitialLoadRef.current = false;
      }
    };

    loadCart();
  }, [user, storageKey]);

  useEffect(() => {
    if (!storageKey || isInitialLoadRef.current) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  useEffect(() => {
    if (!storageKey || isInitialLoadRef.current) return;

    // Only sync to server if user is logged in
    if (!user) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      setSyncing(true);
      try {
        for (const item of items) {
          await addItemToServerCart(item.id, item.quantity, item.size);
        }
      } catch (error) {
      } finally {
        setSyncing(false);
      }
    }, 1000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [items, user, storageKey]);

  const addItem = async (item: CartItem, quantity = 1) => {
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

    setItems((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id && p.size === item.size,
      );
      if (!existing) {
        return [...prev, { ...item, quantity }];
      }
      return prev.map((p) =>
        p.id === item.id && p.size === item.size
          ? { ...p, quantity: p.quantity + quantity }
          : p,
      );
    });

    if (user) {
      try {
        await addItemToServerCart(item.id, quantity, item.size);
      } catch (error) {}
    }

    // Open the drawer when item is added
    setIsDrawerOpen(true);

    return { ok: true };
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const finalQuantity = Math.max(1, quantity);
    const item = items.find((i) => i.id === id);

    try {
      const response = await fetch(`/api/products/${id}/stock`);
      if (response.ok) {
        const stockData = await response.json();
        if (stockData.stock < finalQuantity) {
          const adjustedQuantity = Math.min(stockData.stock, finalQuantity);
          setItems((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, quantity: adjustedQuantity } : i,
            ),
          );
          if (item && user) {
            await updateItemInServerCart(id, adjustedQuantity, item.size);
          }
          return;
        }
      }
    } catch (err) {}

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: finalQuantity } : i)),
    );

    if (item && user) {
      try {
        await updateItemInServerCart(id, finalQuantity, item.size);
      } catch (error) {}
    }
  };

  const removeItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (item && user) {
      try {
        await removeItemFromServerCart(id, item.size);
      } catch (error) {}
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        for (const item of items) {
          await removeItemFromServerCart(item.id, item.size);
        }
      } catch (error) {}
    }
    setItems([]);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const subtotal = useMemo(
    () =>
      (items || []).reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const totalItems = useMemo(
    () => (items || []).reduce((sum, item) => sum + item.quantity, 0),
    [items],
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
        syncing,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
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
