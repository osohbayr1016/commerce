"use client";

interface FilterPriceRangeProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  priceLabel: string;
  minPlaceholder: string;
  maxPlaceholder: string;
}

export default function FilterPriceRange({
  minPrice,
  maxPrice,
  value,
  onChange,
  priceLabel,
  minPlaceholder,
  maxPlaceholder,
}: FilterPriceRangeProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {priceLabel}: {value[0].toLocaleString()} – {value[1].toLocaleString()}
      </label>
      <div className="flex gap-4">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="flex-1 accent-gray-900"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="flex-1 accent-gray-900"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="number"
          min={minPrice}
          max={maxPrice}
          value={value[0]}
          onChange={(e) =>
            onChange([Number(e.target.value), value[1]])
          }
          className="w-24 px-2 py-1.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          placeholder={minPlaceholder}
        />
        <input
          type="number"
          min={minPrice}
          max={maxPrice}
          value={value[1]}
          onChange={(e) =>
            onChange([value[0], Number(e.target.value)])
          }
          className="w-24 px-2 py-1.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          placeholder={maxPlaceholder}
        />
      </div>
    </div>
  );
}
