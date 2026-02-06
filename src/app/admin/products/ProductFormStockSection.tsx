"use client";

import type { ProductType } from "@/types";
import { getSizesForType, CLOTHES_SIZE_LABELS } from "@/lib/product-types";

type Props = {
  productType: ProductType;
  setProductType: (t: ProductType) => void;
  sizeStocks: Record<number, number>;
  setSizeStocks: (s: Record<number, number>) => void;
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
  const sizes = getSizesForType(productType);
  const isBeauty = productType === "beauty";

  function setSizeStock(size: number, qty: number) {
    setSizeStocks({ ...sizeStocks, [size]: Math.max(0, qty) });
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

      {!isBeauty && sizes.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-black mb-3">
            Размер & тоо ширхэг
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sizes.map((size) => (
              <div key={size}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {labelFor(size)}
                </label>
                <input
                  type="number"
                  min={0}
                  value={sizeStocks[size] ?? 0}
                  onChange={(e) =>
                    setSizeStock(size, parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            ))}
          </div>
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
