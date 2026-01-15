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
  const totalImages = images.length || 1;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
        {images.map((imageUrl, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded border-2 transition-all overflow-hidden ${
              selectedImage === index
                ? 'border-gray-900'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: imageColor }}
            aria-label={`View image ${index + 1}`}
          >
            {imageUrl && imageUrl.startsWith('http') ? (
              <img
                src={imageUrl}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : null}
          </button>
        ))}
      </div>
      
      <div className="flex-1 order-1 md:order-2">
        <div
          className="w-full aspect-square rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: imageColor }}
        >
          {images[selectedImage] && images[selectedImage].startsWith('http') ? (
            <>
              <img
                src={images[selectedImage]}
                alt={productName || "Product Image"}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {selectedImage + 1} of {totalImages}
              </span>
            </>
          ) : (
            <>
              <span className="absolute top-3 right-3 text-xs text-gray-500">
                {selectedImage + 1} of {totalImages}
              </span>
              <span className="text-gray-400 text-sm">
                {productName || "Product Image"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
