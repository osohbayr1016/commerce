"use client";

import { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid";
import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
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
      <div className="py-8 border-t border-gray-200">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
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
