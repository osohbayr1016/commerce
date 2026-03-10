"use client";

import type { ProductType } from "@/types";
import {
  CLOTHES_SIZE_LABELS,
  getDefaultSizeForType,
} from "@/lib/product-types";
import { getLocalizedName } from "@/lib/localize";

type CategoryItem = {
  id: number;
  name: string;
  name_en?: string;
  name_mn?: string;
  parent_id?: number | null;
};

type Props = {
  productType: ProductType;
  setProductType: (t: ProductType) => void;
  sizeStocks: Record<number, number>;
  setSizeStocks: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  onAddSize: () => void;
  onRemoveSize: (size: number) => void;
  stock: number;
  onStockChange: (v: number) => void;
  categoryId: string;
  onCategoryChange: (v: string) => void;
  subcategory: string;
  onSubcategoryChange: (v: string) => void;
  hasFinancing: boolean;
  onHasFinancingChange: (v: boolean) => void;
  categories: CategoryItem[];
  colors?: string[];
  colorSizeStocks?: Record<string, Record<number, number>>;
  setColorSizeStocks?: React.Dispatch<
    React.SetStateAction<Record<string, Record<number, number>>>
  >;
};

const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "shoes", label: "Гутал" },
  { value: "clothes", label: "Хувцас" },
  { value: "beauty", label: "Гоо сайхан" },
  { value: "other", label: "Бусад" },
];

export default function ProductFormStockSection({
  productType,
  setProductType,
  sizeStocks,
  setSizeStocks,
  onAddSize,
  onRemoveSize,
  stock,
  onStockChange,
  categoryId,
  onCategoryChange,
  subcategory,
  onSubcategoryChange,
  hasFinancing,
  onHasFinancingChange,
  categories,
  colors = [],
  colorSizeStocks = {},
  setColorSizeStocks,
}: Props) {
  const isNoSize = productType === "beauty" || productType === "other";
  const useColorStocks = colors.length > 0 && setColorSizeStocks;

  const roots = categories.filter((c) => c.parent_id == null);
  const selectedRootId = categoryId
    ? (() => {
        const cat = categories.find((c) => c.id === Number(categoryId));
        return cat?.parent_id ?? Number(categoryId);
      })()
    : null;
  const subcategories = selectedRootId
    ? categories.filter((c) => c.parent_id === selectedRootId)
    : [];
  const isOtherWithColors =
    productType === "other" && colors.length > 0 && setColorSizeStocks;
  const entries = Object.entries(sizeStocks)
    .map(([size, stockQty]) => ({ size: Number(size), stock: stockQty }))
    .filter((e) => !isNaN(e.size))
    .sort((a, b) => a.size - b.size);

  function setSizeStock(size: number, qty: number) {
    setSizeStocks({ ...sizeStocks, [size]: Math.max(0, qty) });
  }

  function handleSizeChange(oldSize: number, newSizeRaw: number) {
    const newSize = Math.max(0, Math.floor(newSizeRaw));
    if (newSize === oldSize) return;
    setSizeStocks((prev: Record<number, number>) => {
      const next: Record<number, number> = { ...prev };
      delete next[oldSize];
      next[newSize] = prev[oldSize] ?? 0;
      return next;
    });
  }

  function labelFor(size: number): string {
    if (productType === "clothes" && size in CLOTHES_SIZE_LABELS) {
      return CLOTHES_SIZE_LABELS[size as keyof typeof CLOTHES_SIZE_LABELS];
    }
    return String(size);
  }

  function addSizeForColor(color: string) {
    if (!setColorSizeStocks) return;
    const cur = colorSizeStocks[color] || {};
    const nextSize =
      Object.keys(cur).length === 0
        ? getDefaultSizeForType(productType)
        : Math.max(0, ...Object.keys(cur).map(Number), 0) + 1;
    setColorSizeStocks((prev) => ({
      ...prev,
      [color]: { ...prev[color], [nextSize]: 0 },
    }));
  }

  function removeSizeForColor(color: string, size: number) {
    if (!setColorSizeStocks) return;
    setColorSizeStocks((prev) => {
      const next = { ...prev, [color]: { ...prev[color] } };
      delete next[color][size];
      return next;
    });
  }

  function setSizeStockForColor(color: string, size: number, qty: number) {
    if (!setColorSizeStocks) return;
    setColorSizeStocks((prev) => ({
      ...prev,
      [color]: { ...prev[color], [size]: Math.max(0, qty) },
    }));
  }

  function handleSizeChangeForColor(
    color: string,
    oldSize: number,
    newSizeRaw: number,
  ) {
    if (!setColorSizeStocks) return;
    const newSize = Math.max(0, Math.floor(newSizeRaw));
    if (newSize === oldSize) return;
    setColorSizeStocks((prev) => {
      const c = prev[color] || {};
      const next = { ...prev, [color]: { ...c } };
      delete next[color][oldSize];
      next[color][newSize] = c[oldSize] ?? 0;
      return next;
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-black mb-4">Ангилал & Нөөц</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Ангилал (root)
          </label>
          <select
            value={selectedRootId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onCategoryChange(v || "");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Сонгоно уу</option>
            {roots.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getLocalizedName(cat, "mn") || cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Дэд ангилал
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={!selectedRootId}
          >
            <option value={selectedRootId ?? ""}>
              {selectedRootId ? "Бүгд" : "Эхлээд ангилал сонгоно уу"}
            </option>
            {subcategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getLocalizedName(cat, "mn") || cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold text-black mb-2">
          Бүтээгдэхүүний төрөл
        </label>
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value as ProductType)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {PRODUCT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isNoSize && !isOtherWithColors && (
        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Нөөц *
          </label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => onStockChange(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>
      )}

      {isOtherWithColors && (
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-black">
            Өнгөөр нь үлдэгдэл
          </h3>
          {colors.map((color) => (
            <div
              key={color}
              className="flex flex-wrap items-center gap-4 border border-gray-200 rounded-lg p-4"
            >
              <p className="text-sm font-semibold text-gray-900 min-w-[80px]">
                Өнгө: {color}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Тоо ширхэг
                </label>
                <input
                  type="number"
                  min={0}
                  value={colorSizeStocks[color]?.[0] ?? 0}
                  onChange={(e) => {
                    if (!setColorSizeStocks) return;
                    const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setColorSizeStocks((prev) => ({
                      ...prev,
                      [color]: { 0: val },
                    }));
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isNoSize && !useColorStocks && (
        <div>
          <h3 className="text-base font-semibold text-black mb-3">
            Размер & тоо ширхэг
          </h3>
          {entries.length === 0 ? (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-gray-600">
                Размер нэмэх товч дарж размер болон тоо ширхэг оруулна уу.
              </p>
              <button
                type="button"
                onClick={onAddSize}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Размер нэмэх
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {entries.map(({ size, stock: stockQty }) => (
                  <div
                    key={size}
                    className="flex flex-wrap items-center gap-3 gap-y-2"
                  >
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Размер
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={size}
                        onChange={(e) =>
                          handleSizeChange(
                            size,
                            parseInt(e.target.value, 10) || 0,
                          )
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Тоо ширхэг
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={stockQty}
                        onChange={(e) =>
                          setSizeStock(size, parseInt(e.target.value, 10) || 0)
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveSize(size)}
                      className="text-sm text-red-600 hover:text-red-800"
                      aria-label="Remove size"
                    >
                      Устгах
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onAddSize}
                className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Размер нэмэх
              </button>
            </>
          )}
        </div>
      )}

      {!isNoSize && useColorStocks && (
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-black">
            Өнгөөр нь размер & тоо ширхэг
          </h3>
          {colors.map((color) => {
            const curStocks = colorSizeStocks[color] || {};
            const curEntries = Object.entries(curStocks)
              .map(([s, q]) => ({ size: Number(s), stock: q }))
              .filter((e) => !isNaN(e.size))
              .sort((a, b) => a.size - b.size);
            return (
              <div
                key={color}
                className="border border-gray-200 rounded-lg p-4"
              >
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Өнгө: {color}
                </p>
                {curEntries.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => addSizeForColor(color)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Размер нэмэх
                  </button>
                ) : (
                  <>
                    <div className="space-y-3">
                      {curEntries.map(({ size, stock: stockQty }) => (
                        <div
                          key={size}
                          className="flex flex-wrap items-center gap-3 gap-y-2"
                        >
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                              Размер
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={size}
                              onChange={(e) =>
                                handleSizeChangeForColor(
                                  color,
                                  size,
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                          </div>
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                              Тоо ширхэг
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={stockQty}
                              onChange={(e) =>
                                setSizeStockForColor(
                                  color,
                                  size,
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSizeForColor(color, size)}
                            className="text-sm text-red-600 hover:text-red-800"
                            aria-label="Remove size"
                          >
                            Устгах
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addSizeForColor(color)}
                      className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Размер нэмэх
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={hasFinancing}
          onChange={(e) => onHasFinancingChange(e.target.checked)}
          className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
        />
        <label className="ml-3 text-base font-medium text-black">
          Зээлийн боломжтой
        </label>
      </div>
    </div>
  );
}
