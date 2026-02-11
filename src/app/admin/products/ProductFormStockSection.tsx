"use client";

import type { ProductType } from "@/types";
import { CLOTHES_SIZE_LABELS } from "@/lib/product-types";

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
  categories: { id: number; name: string }[];
};

const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "shoes", label: "Гутал" },
  { value: "clothes", label: "Хувцас" },
  { value: "beauty", label: "Гоо сайхан" },
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
}: Props) {
  const isBeauty = productType === "beauty";
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-black mb-4">Ангилал & Нөөц</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Ангилал
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Сонгоно уу</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Дэд ангилал
          </label>
          <input
            type="text"
            value={subcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Жишээ: Гутал"
          />
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

      {isBeauty && (
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

      {!isBeauty && (
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
