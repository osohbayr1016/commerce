'use client';

import { useState } from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

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
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
        {images.map((imageUrl, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded border-2 transition-all overflow-hidden relative ${
              selectedImage === index
                ? 'border-gray-900'
                : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundColor: imageColor }}
            aria-label={`View image ${index + 1}`}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            ) : null}
          </button>
        ))}
      </div>
      
      {/* Main Feature Image with Luxury Zoom */}
      <div className="flex-1 order-1 md:order-2">
        <div
          className="w-full aspect-square rounded-lg flex items-center justify-center relative overflow-hidden group cursor-zoom-in pointer-events-auto"
          style={{ backgroundColor: imageColor }}
        >
          {images[selectedImage] ? (
            <Zoom zoomMargin={45}>
              <div className="relative w-full aspect-square">
                <Image
                  src={images[selectedImage]}
                  alt={productName || "Product Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Zoom>
          ) : (
            <span className="text-gray-400 text-sm">
              {productName || "Product Image"}
            </span>
          )}
          {images[selectedImage] && (
            <span className="absolute top-3 right-3 text-xs text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full z-10 font-medium pointer-events-none">
              {selectedImage + 1} / {totalImages}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
