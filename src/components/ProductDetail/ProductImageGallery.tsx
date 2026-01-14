'use client';

import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  imageColor: string;
  productName: string;
}

export default function ProductImageGallery({
  images,
  imageColor,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded border-2 transition-all ${
              selectedImage === index
                ? 'border-gray-900'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: imageColor }}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="flex-1 order-1 md:order-2">
        <div
          className="w-full aspect-square rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center"
          style={{ backgroundColor: imageColor }}
        >
          <span className="text-gray-400 text-sm">Product Image {selectedImage + 1}</span>
        </div>
      </div>
    </div>
  );
}
