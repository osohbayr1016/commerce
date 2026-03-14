"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedName } from "@/lib/localize";
import FilterSection from "./FilterSection";
import FilterPriceRange from "./FilterPriceRange";
import FilterChipList from "./FilterChipList";

interface SubcategoryItem {
  id: number;
  slug: string;
  name: string;
  name_en?: string;
  name_mn?: string;
  name_ru?: string;
  name_zh?: string;
  name_it?: string;
}

interface ProductFiltersProps {
  brands?: string[];
  availableColors?: string[];
  subcategories?: SubcategoryItem[];
  selectedSubcategory?: string;
  rootSlug?: string;
  availableSizes?: number[];
  minPrice?: number;
  maxPrice?: number;
}

export default function ProductFilters({
  brands = [],
  availableColors = [],
  subcategories = [],
  selectedSubcategory,
  rootSlug,
  availableSizes = [],
  minPrice = 0,
  maxPrice = 1000000,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const brandsParam = searchParams.get("brands");
    const colorsParam = searchParams.get("colors");
    const sizesParam = searchParams.get("sizes");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const stockParam = searchParams.get("inStock");
    if (brandsParam) setSelectedBrands(brandsParam.split(",").filter(Boolean));
    if (colorsParam) setSelectedColors(colorsParam.split(",").filter(Boolean));
    if (sizesParam) setSelectedSizes(sizesParam.split(",").map(Number).filter(Boolean));
    if (minPriceParam) setPriceRange((prev) => [Number(minPriceParam), prev[1]]);
    if (maxPriceParam) setPriceRange((prev) => [prev[0], Number(maxPriceParam)]);
    if (stockParam === "true") setInStockOnly(true);
  }, [searchParams]);

  const setSubcategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("subcategory", slug);
    else params.delete("subcategory");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedBrands.length > 0) params.set("brands", selectedBrands.join(","));
    else params.delete("brands");
    if (selectedColors.length > 0) params.set("colors", selectedColors.join(","));
    else params.delete("colors");
    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
    else params.delete("sizes");
    if (priceRange[0] > minPrice) params.set("minPrice", priceRange[0].toString());
    else params.delete("minPrice");
    if (priceRange[1] < maxPrice) params.set("maxPrice", priceRange[1].toString());
    else params.delete("maxPrice");
    inStockOnly ? params.set("inStock", "true") : params.delete("inStock");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([minPrice, maxPrice]);
    setInStockOnly(false);
    router.push("?" + new URLSearchParams().toString());
  };

  const hasSubcategory = !!selectedSubcategory;
  const hasActiveFilters = useMemo(
    () =>
      hasSubcategory ||
      selectedBrands.length > 0 ||
      selectedColors.length > 0 ||
      selectedSizes.length > 0 ||
      priceRange[0] > minPrice ||
      priceRange[1] < maxPrice ||
      inStockOnly,
    [hasSubcategory, selectedBrands, selectedColors, selectedSizes, priceRange, minPrice, maxPrice, inStockOnly]
  );
  const activeCount = [
    hasSubcategory ? 1 : 0,
    selectedBrands.length,
    selectedColors.length,
    selectedSizes.length,
    priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0,
    inStockOnly ? 1 : 0,
  ].filter(Boolean).reduce((a, b) => a + b, 0);

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {t("products.refine")}
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full">
              {activeCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            {t("products.clearFilters")}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-6">
          {subcategories.length > 0 && rootSlug && (
            <FilterSection label={t("products.subcategory")}>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSubcategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    !selectedSubcategory
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {t("products.allSubcategories")}
                </button>
                {subcategories.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSubcategory(sc.slug)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedSubcategory === sc.slug
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {getLocalizedName(sc, language) || sc.name}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          <FilterSection label={t("products.priceRange")}>
            <FilterPriceRange
              minPrice={minPrice}
              maxPrice={maxPrice}
              value={priceRange}
              onChange={setPriceRange}
              priceLabel={t("products.priceRange")}
              minPlaceholder={t("products.priceMin")}
              maxPlaceholder={t("products.priceMax")}
            />
          </FilterSection>

          {brands.length > 0 && (
            <FilterSection label={t("products.brand")}>
              <FilterChipList
                options={brands}
                selected={selectedBrands}
                onToggle={(b) =>
                  setSelectedBrands((prev) =>
                    prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
                  )
                }
              />
            </FilterSection>
          )}

          {availableColors.length > 0 && (
            <FilterSection label={t("products.color")}>
              <FilterChipList
                options={availableColors}
                selected={selectedColors}
                onToggle={(c) =>
                  setSelectedColors((prev) =>
                    prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                  )
                }
              />
            </FilterSection>
          )}

          {availableSizes.length > 0 && (
            <FilterSection label={t("products.size")}>
              <FilterChipList
                options={[...availableSizes].sort((a, b) => a - b)}
                selected={selectedSizes}
                onToggle={(s) =>
                  setSelectedSizes((prev) =>
                    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                  )
                }
                sizeVariant="square"
              />
            </FilterSection>
          )}

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">{t("products.inStockOnly")}</span>
            </label>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {t("products.applyFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
