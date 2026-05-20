"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setProgress(0);
    setVisible(true);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + Math.random() * 8 + 4;
        if (prev < 70) return prev + Math.random() * 4 + 2;
        if (prev < 90) return prev + Math.random() * 2 + 0.5;
        if (prev < 98) return prev + 0.1;
        return prev;
      });
    }, 150);
  };

  const completeProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgress(100);

    fadeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setProgress(0);
      }, 300);
    }, 400);
  };

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip special links, new tabs, and self-navigating links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.getAttribute("target") === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.origin);

        // Verify same origin
        if (currentUrl.origin !== targetUrl.origin) return;

        // Skip if navigating to the same URL path and query
        if (
          currentUrl.pathname === targetUrl.pathname &&
          currentUrl.search === targetUrl.search
        ) {
          return;
        }

        startProgress();
      } catch (err) {
        // Fallback: ignore URL parse issues
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  // Complete progress on actual route changes
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Golden Luxury Progress Bar */}
      <div
        className="h-[3px] bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 shadow-[0_0_8px_rgba(251,191,36,0.85),_0_0_4px_rgba(251,191,36,0.5)] transition-all duration-300 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Trailing golden glow effect */}
        <div className="absolute right-0 top-0 h-full w-[100px] bg-gradient-to-r from-transparent to-white/60 blur-[3px] pointer-events-none" />
      </div>
    </div>
  );
}
