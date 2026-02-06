"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import HeroCarouselSlide, { type HeroBanner } from "./HeroCarouselSlide";
import HeroCarouselEmpty from "./HeroCarouselEmpty";
import HeroCarouselControls from "./HeroCarouselControls";

function toBanners(data: unknown): HeroBanner[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (b): b is Record<string, unknown> =>
        b != null &&
        typeof b === "object" &&
        typeof (b as { id?: unknown }).id === "string",
    )
    .map((b: Record<string, unknown>) => ({
      id: String(b.id),
      image_url: typeof b.image_url === "string" ? b.image_url : "",
      title: b.title != null ? String(b.title) : null,
      link: b.link != null ? String(b.link) : null,
    }));
}

interface HeroCarouselProps {
  initialBanners?: HeroBanner[];
}

export default function HeroCarousel({
  initialBanners = [],
}: HeroCarouselProps) {
  const [banners, setBanners] = useState<HeroBanner[]>(toBanners(initialBanners));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(initialBanners.length === 0);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/hero`
        : "/api/hero";
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
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
    },
    [],
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || banners.length === 0) return;
    const w = el.offsetWidth;
    const index = Math.round(el.scrollLeft / w);
    setCurrentIndex(Math.min(index, banners.length - 1));
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full aspect-video md:aspect-[21/9] max-h-[300px] md:max-h-[400px] bg-gray-100 animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return <HeroCarouselEmpty />;
  }

  return (
    <div className="relative w-full bg-gray-100 group">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full aspect-video md:aspect-[21/9] max-h-[280px] sm:max-h-[320px] md:max-h-[420px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
      >
        {banners.map((banner) => (
          <HeroCarouselSlide
            key={banner.id}
            banner={banner}
            isFailed={failedImageIds.has(banner.id)}
            onError={() =>
              setFailedImageIds((prev) => new Set(prev).add(banner.id))
            }
          />
        ))}
      </div>
      <HeroCarouselControls
        count={banners.length}
        currentIndex={currentIndex}
        onPrev={() =>
          setCurrentIndex(
            (prev) => (prev - 1 + banners.length) % banners.length,
          )
        }
        onNext={() =>
          setCurrentIndex((prev) => (prev + 1) % banners.length)
        }
        onGoTo={setCurrentIndex}
      />
    </div>
  );
}
