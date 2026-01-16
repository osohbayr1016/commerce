"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types";
import { useToast } from "@/components/ui/ToastContainer";

interface ComparisonContextType {
  comparisonProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("comparison");
    if (stored) {
      try {
        setComparisonProducts(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("comparison");
      }
    }
  }, []);

  useEffect(() => {
    if (comparisonProducts.length > 0) {
      localStorage.setItem("comparison", JSON.stringify(comparisonProducts));
    } else {
      localStorage.removeItem("comparison");
    }
  }, [comparisonProducts]);

  const addToComparison = (product: Product) => {
    if (comparisonProducts.length >= MAX_COMPARISON_ITEMS) {
      showToast(`Maximum ${MAX_COMPARISON_ITEMS} products can be compared`, "error");
      return;
    }

    if (comparisonProducts.find((p) => p.id === product.id)) {
      showToast("Product already in comparison", "info");
      return;
    }

    setComparisonProducts((prev) => [...prev, product]);
    showToast("Added to comparison", "success");
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast("Removed from comparison", "info");
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    localStorage.removeItem("comparison");
    showToast("Comparison cleared", "info");
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.some((p) => p.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
}
