"use client";

import Link from "next/link";

export interface HeroBanner {
  id: string;
  image_url: string;
  title: string | null;
  link: string | null;
}

interface HeroCarouselSlideProps {
  banner: HeroBanner;
  isFailed: boolean;
  onError: () => void;
}

export default function HeroCarouselSlide({
  banner,
  isFailed,
  onError,
}: HeroCarouselSlideProps) {
  return (
    <div className="relative w-full min-w-full h-full shrink-0 snap-center snap-always">
      {isFailed || !banner.image_url ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-lg font-medium">E-Commerce</span>
        </div>
      ) : (
        <img
          src={banner.image_url}
          alt={banner.title || "Banner"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={onError}
        />
      )}
      {(banner.title || banner.link) && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white p-4">
            {banner.title && (
              <h2 className="text-2xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {banner.title}
              </h2>
            )}
            {banner.link && (
              <Link
                href={banner.link}
                className="inline-block px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors"
              >
                Дэлгэрэнгүй
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
