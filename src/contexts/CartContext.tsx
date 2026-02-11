"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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
  removeItem: (id: string, size?: number) => void;
  clearCart: () => void;
  syncing: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CART_GUEST_KEY = "cart:guest";

function readCartFromStorage(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const hasHydratedRef = useRef(false);

  const storageKey = user ? `cart:${user.id}` : CART_GUEST_KEY;

  const persistToStorage = (nextItems: CartItem[], key: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(nextItems));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  };

  // Restore cart from localStorage before paint (useLayoutEffect runs before useEffect).
  // Prevents the persist effect from running with items=[] and wiping storage.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    hasHydratedRef.current = true;
    const stored = readCartFromStorage(storageKey);
    if (stored.length > 0) {
      setItems(stored);
    }
    isInitialLoadRef.current = false;
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) {
      setItems([]);
      return;
    }

    // Guest: cart is restored by the hydration effect; don't run loadCart
    // so we never overwrite with a stale/empty read.
    if (!user) {
      isInitialLoadRef.current = false;
      setSyncing(false);
      return;
    }

    const loadCart = async () => {
      setSyncing(true);
      try {
        let serverItems: CartItem[] = [];
        try {
          serverItems = await fetchCartFromServer();
        } catch (e) {
          console.error("Failed to fetch server cart", e);
        }

        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem(storageKey)
            : null;
        let localItems: CartItem[] = [];
        try {
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) localItems = parsed;
        } catch (e) {
          console.error("Error parsing cart from localStorage", e);
        }

        const mergedItems = [
          ...(Array.isArray(serverItems) ? serverItems : []),
        ];
        localItems.forEach((localItem: CartItem) => {
          const exists = mergedItems.find(
            (item) => item.id === localItem.id && item.size === localItem.size,
          );
          if (!exists) mergedItems.push(localItem);
        });

        setItems(mergedItems);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, JSON.stringify(mergedItems));
          } catch {}
        }

        if (
          localItems.length > 0 &&
          serverItems.length !== mergedItems.length
        ) {
          await syncCartToServer(mergedItems);
        }
      } catch (error) {
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const fallback = JSON.parse(raw);
            if (Array.isArray(fallback)) setItems(fallback);
          }
        } catch {}
      } finally {
        setSyncing(false);
        isInitialLoadRef.current = false;
      }
    };

    loadCart();
  }, [user, storageKey]);

  // Persist to localStorage whenever items change so cart survives refresh.
  // Never write [] during initial load (would wipe saved cart before hydration runs).
  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) return;
    if (items.length === 0 && isInitialLoadRef.current) return;
    if (!hasHydratedRef.current && items.length === 0) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
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
      const next = existing
        ? prev.map((p) =>
            p.id === item.id && p.size === item.size
              ? { ...p, quantity: p.quantity + quantity }
              : p,
          )
        : [...prev, { ...item, quantity }];
      persistToStorage(next, storageKey);
      return next;
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
          setItems((prev) => {
            const next = prev.map((i) =>
              i.id === id ? { ...i, quantity: adjustedQuantity } : i,
            );
            persistToStorage(next, storageKey);
            return next;
          });
          if (item && user) {
            await updateItemInServerCart(id, adjustedQuantity, item.size);
          }
          return;
        }
      }
    } catch (err) {}

    setItems((prev) => {
      const next = prev.map((i) =>
        i.id === id ? { ...i, quantity: finalQuantity } : i,
      );
      persistToStorage(next, storageKey);
      return next;
    });

    if (item && user) {
      try {
        await updateItemInServerCart(id, finalQuantity, item.size);
      } catch (error) {}
    }
  };

  const removeItem = async (id: string, size?: number) => {
    const item = items.find((i) => i.id === id && i.size === size);
    setItems((prev) => {
      const next = prev.filter(
        (i) => !(i.id === id && (size === undefined || i.size === size)),
      );
      persistToStorage(next, storageKey);
      return next;
    });

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
    const empty: CartItem[] = [];
    persistToStorage(empty, storageKey);
    setItems(empty);
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
