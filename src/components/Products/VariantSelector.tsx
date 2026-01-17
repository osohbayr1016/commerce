'use client';

import { useState, useEffect } from 'react';

interface VariantSelectorProps {
  colors?: string[];
  materials?: string[];
  sizes?: number[];
  defaultColor?: string;
  defaultMaterial?: string;
  defaultSize?: number;
  onVariantChange: (variant: {
    color?: string;
    material?: string;
    size?: number;
  }) => void;
}

export default function VariantSelector({
  colors = [],
  materials = [],
  sizes = [],
  defaultColor,
  defaultMaterial,
  defaultSize,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultColor);
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>(defaultMaterial);
  const [selectedSize, setSelectedSize] = useState<number | undefined>(defaultSize);

  useEffect(() => {
    onVariantChange({
      color: selectedColor,
      material: selectedMaterial,
      size: selectedSize,
    });
  }, [selectedColor, selectedMaterial, selectedSize, onVariantChange]);

  const hasVariants = colors.length > 0 || materials.length > 0 || sizes.length > 0;

  if (!hasVariants) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Color
            {selectedColor && (
              <span className="ml-2 text-gray-600">- {selectedColor}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                  selectedColor === color
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Material Selection */}
      {materials.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Material
            {selectedMaterial && (
              <span className="ml-2 text-gray-600">- {selectedMaterial}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            {materials.map((material) => (
              <button
                key={material}
                type="button"
                onClick={() => setSelectedMaterial(material)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                  selectedMaterial === material
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {material}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Size
            {selectedSize && (
              <span className="ml-2 text-gray-600">- {selectedSize}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition min-w-[60px] ${
                  selectedSize === size
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Variant Summary */}
      {(selectedColor || selectedMaterial || selectedSize) && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Selected:{' '}
            <span className="font-medium text-gray-900">
              {[selectedColor, selectedMaterial, selectedSize]
                .filter(Boolean)
                .join(' / ')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
