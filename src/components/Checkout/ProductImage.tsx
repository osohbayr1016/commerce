"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductImageProps {
  productId: string;
  images?: string[];
  imageColor?: string;
  alt: string;
}

export default function ProductImage({
  productId,
  images,
  imageColor,
  alt,
}: ProductImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      let foundImage: string | null = null;

      if (images && Array.isArray(images) && images.length > 0) {
        const firstImg = images[0];
        if (firstImg && typeof firstImg === "string" && firstImg.trim() && !firstImg.match(/^image\d+$/)) {
          foundImage = firstImg.trim();
        }
      }

      if (!foundImage) {
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const product = await response.json();
            if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
              const firstImg = product.images[0];
              if (firstImg && typeof firstImg === "string" && firstImg.trim() && !firstImg.match(/^image\d+$/)) {
                foundImage = firstImg.trim();
              }
            }
          }
        } catch (error) {
        }
      }

      setImageUrl(foundImage || null);
      setLoading(false);
    };

    loadImage();
  }, [productId, images]);

  if (loading) {
    return (
      <div
        className="w-full h-full bg-gray-100 flex items-center justify-center"
        style={{ backgroundColor: imageColor || "#FAFAFA" }}
      >
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="80px"
        className="object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="w-full h-full bg-gray-100 flex items-center justify-center"
      style={{ backgroundColor: imageColor || "#FAFAFA" }}
    >
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
}