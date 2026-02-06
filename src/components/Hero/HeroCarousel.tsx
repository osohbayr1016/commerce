'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  link: string | null;
}

function toBanners(data: unknown): Banner[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((b): b is Record<string, unknown> => b != null && typeof b === 'object' && typeof (b as { id?: unknown }).id === 'string')
    .map((b: Record<string, unknown>) => ({
      id: String(b.id),
      image_url: typeof b.image_url === 'string' ? b.image_url : '',
      title: b.title != null ? String(b.title) : null,
      link: b.link != null ? String(b.link) : null,
    }));
}

interface HeroCarouselProps {
  initialBanners?: Banner[];
}

export default function HeroCarousel({ initialBanners = [] }: HeroCarouselProps) {
  const [banners, setBanners] = useState<Banner[]>(toBanners(initialBanners));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(initialBanners.length === 0);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/api/hero` : '/api/hero';
    let cancelled = false;
    async function fetchBanners() {
      try {
        const res = await fetch(url);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          const next = toBanners(data);
          if (next.length > 0) setBanners(next);
        }
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBanners();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
     return <div className="w-full h-[300px] md:h-[400px] bg-gray-100 animate-pulse" />;
  }

  if (banners.length === 0) {
    // Fallback to original static content
    return (
        <section className="bg-white w-full py-10 md:py-14 lg:py-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Your Company</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900">
                  E-Commerce
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  Онлайн худалдааг хөгжүүлэгч платформ
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm md:text-base">
                <span>Дэлгүүр хэсэх</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 group">
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
                {failedImageIds.has(banner.id) || !banner.image_url ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">E-Commerce</span>
                  </div>
                ) : (
                  <img
                    src={banner.image_url}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImageIds((prev) => new Set(prev).add(banner.id))}
                  />
                )}
                {(banner.title || banner.link) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            {banner.title && (
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{banner.title}</h2>
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
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {banners.length > 1 && (
        <>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </>
      )}
    </div>
  );
}
