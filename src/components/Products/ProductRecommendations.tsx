"use client";

import { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid";
import { Product } from "@/data/mockProducts";

interface ProductRecommendationsProps {
  productId: string;
}

export default function ProductRecommendations({
  productId,
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `/api/products/${productId}/recommendations?limit=6`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Танд зөвлөж байна
        </h2>
        <div className="text-center py-8 text-gray-500">Уншиж байна...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Танд зөвлөж байна
      </h2>
      <ProductGrid products={products} />
    </div>
  );
}
