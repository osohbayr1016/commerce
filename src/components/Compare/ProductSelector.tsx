"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useComparison } from "@/contexts/ComparisonContext";

interface ProductSelectorProps {
  onClose: () => void;
  excludeIds: string[];
}

export default function ProductSelector({ onClose, excludeIds }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToComparison } = useComparison();
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from("products")
        .select("*")
        .limit(20);

      if (excludeIds.length > 0) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }

      if (search) {
        query = query.or(`name_en.ilike.%${search}%,name_mn.ilike.%${search}%,brand.ilike.%${search}%`);
      }

      const { data } = await query;

      if (data) {
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name_en: item.name_en,
          name_mn: item.name_mn,
          brand: item.brand,
          price: item.price,
          original_price: item.original_price,
          images: item.images || [],
          brand_color: item.brand_color,
          image_color: item.image_color,
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (product: Product) => {
    addToComparison(product);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add Product to Compare</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No products found</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="text-left border border-gray-200 rounded-lg p-3 hover:border-gray-900 hover:shadow-md transition"
                  >
                    <div className="mb-2">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name_en || product.name_mn || ""}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ) : (
                        <div
                          className="w-full aspect-square rounded"
                          style={{ backgroundColor: product.image_color || "#f5f5f5" }}
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {product.name_en}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Intl.NumberFormat("mn-MN").format(product.price || 0)} ₮
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
