"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useComparison } from "@/contexts/ComparisonContext";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ProductSelector from "@/components/Compare/ProductSelector";
import ComparisonTable from "@/components/Compare/ComparisonTable";
import EmptyState from "@/components/ui/EmptyState";
import BackButton from "@/components/ui/BackButton";

export default function ComparePageContent() {
  const router = useRouter();
  const { comparisonProducts, removeFromComparison, clearComparison } =
    useComparison();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<
    Record<string, { average: number; count: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (comparisonProducts.length > 0) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [comparisonProducts]);

  const fetchProductDetails = async () => {
    try {
      const productIds = comparisonProducts.map((p) => p.id).filter(Boolean);

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsData) {
        const mappedProducts: Product[] = productsData.map((item: any) => ({
          id: item.id,
          name_en: item.name_en,
          name_mn: item.name_mn,
          brand: item.brand,
          price: item.price,
          original_price: item.original_price,
          discount: item.discount,
          stock: item.stock,
          sizes: item.sizes,
          description: item.description,
          images: item.images || [],
          brand_color: item.brand_color,
          image_color: item.image_color,
        }));
        setProducts(mappedProducts);

        const reviewsData: Record<string, { average: number; count: number }> =
          {};
        for (const id of productIds) {
          const { data: reviewData } = await supabase
            .from("product_reviews")
            .select("rating")
            .eq("product_id", id);

          if (reviewData && reviewData.length > 0) {
            const avg =
              reviewData.reduce((sum: number, r: any) => sum + r.rating, 0) /
              reviewData.length;
            reviewsData[id as string] = {
              average: avg,
              count: reviewData.length,
            };
          } else {
            reviewsData[id as string] = { average: 0, count: 0 };
          }
        }
        setReviews(reviewsData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading comparison...</p>
        </main>
      </div>
    );
  }

  if (comparisonProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <BackButton />
            </div>
            <EmptyState
              icon={
                <svg
                  className="w-24 h-24 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="No products to compare"
              description="Add products from product pages to start comparing"
              action={{
                label: "Browse Products",
                onClick: () => router.push("/"),
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Comparison
              </h1>
              <p className="text-gray-600 mt-1">
                Compare {comparisonProducts.length} product
                {comparisonProducts.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              {comparisonProducts.length < 4 && (
                <button
                  onClick={() => setShowSelector(true)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Add Product
                </button>
              )}
              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Clear All
              </button>
            </div>
          </div>

          <ComparisonTable
            products={products}
            reviews={reviews}
            onRemove={removeFromComparison}
          />
        </div>
      </main>

      {showSelector && (
        <ProductSelector
          onClose={() => setShowSelector(false)}
          excludeIds={
            comparisonProducts.map((p) => p.id).filter(Boolean) as string[]
          }
        />
      )}
    </div>
  );
}
