"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductCardImageProps {
  images?: string[];
  alt: string;
  imageColor?: string;
}

export default function ProductCardImage({
  images,
  alt,
  imageColor = "#FAFAFA",
}: ProductCardImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSecondImage = images && images.length > 1;
  const primary = images?.[0];
  const secondary = images?.[1];

  if (!primary) {
    return (
      <div
        className="w-full aspect-square bg-gray-100"
        style={{ backgroundColor: imageColor }}
      />
    );
  }

  return (
    <div
      className="relative w-full aspect-square overflow-hidden bg-gray-50"
      onMouseEnter={() => hasSecondImage && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={primary}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover hover-premium-zoom"
        loading="lazy"
      />
      {hasSecondImage && secondary && (
        <Image
          src={secondary}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover absolute inset-0 transition-opacity duration-300 hover-premium-zoom ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
}
