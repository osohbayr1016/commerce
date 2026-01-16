"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

interface ProductFiltersProps {
  brands?: string[];
  availableSizes?: number[];
  minPrice?: number;
  maxPrice?: number;
}

export default function ProductFilters({
  brands = [],
  availableSizes = [],
  minPrice = 0,
  maxPrice = 1000000,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const brandsParam = searchParams.get("brands");
    const sizesParam = searchParams.get("sizes");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const stockParam = searchParams.get("inStock");

    if (brandsParam) {
      setSelectedBrands(brandsParam.split(",").filter(Boolean));
    }
    if (sizesParam) {
      setSelectedSizes(sizesParam.split(",").map(Number).filter(Boolean));
    }
    if (minPriceParam) {
      setPriceRange([Number(minPriceParam), priceRange[1]]);
    }
    if (maxPriceParam) {
      setPriceRange([priceRange[0], Number(maxPriceParam)]);
    }
    if (stockParam === "true") {
      setInStockOnly(true);
    }
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","));
    } else {
      params.delete("brands");
    }

    if (selectedSizes.length > 0) {
      params.set("sizes", selectedSizes.join(","));
    } else {
      params.delete("sizes");
    }

    if (priceRange[0] > minPrice) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }

    if (priceRange[1] < maxPrice) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }

    if (inStockOnly) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceRange([minPrice, maxPrice]);
    setInStockOnly(false);
    const params = new URLSearchParams();
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      selectedBrands.length > 0 ||
      selectedSizes.length > 0 ||
      priceRange[0] > minPrice ||
      priceRange[1] < maxPrice ||
      inStockOnly
    );
  }, [selectedBrands, selectedSizes, priceRange, minPrice, maxPrice, inStockOnly]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          Шүүлт
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full">
              {[
                selectedBrands.length,
                selectedSizes.length,
                priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0,
                inStockOnly ? 1 : 0,
              ]
                .filter(Boolean)
                .reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Цэвэрлэх
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Үнэ: {priceRange[0].toLocaleString()}₮ - {priceRange[1].toLocaleString()}₮
            </label>
            <div className="flex gap-4">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="flex-1"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="flex-1"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Brands */}
          {brands.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Брэнд
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedBrands.includes(brand)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Хэмжээ
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes
                  .sort((a, b) => a - b)
                  .map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-12 rounded border text-sm font-medium transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Stock Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">
                Зөвхөн бэлэн бараа
              </span>
            </label>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyFilters}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Хэрэглэх
          </button>
        </div>
      )}
    </div>
  );
}
