"use client";

import { useState, useEffect, useRef } from "react";
import SearchAutocomplete from "@/components/Search/SearchAutocomplete";

interface SearchButtonProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function SearchButton({ onToggle }: SearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Small delay to trigger expansion animation
      setTimeout(() => setIsExpanded(true), 10);
    } else {
      setIsExpanded(false);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (isOpen) {
    return (
      <div
        ref={containerRef}
        className="flex-1 md:flex-initial min-w-0 flex items-center justify-end md:justify-start overflow-hidden"
      >
        {/* Desktop: expanding search bar */}
        <div className="hidden md:block relative z-20">
          <div
            className={`transition-all duration-300 ease-out overflow-visible ${
              isExpanded ? "w-[400px] opacity-100" : "w-9 opacity-0"
            }`}
            style={{ transitionProperty: "width, opacity" }}
          >
            <div className="relative w-full">
              <SearchAutocomplete onClose={handleClose} />
            </div>
          </div>
        </div>

        {/* Mobile: inline expanding bar (fills header except logo) */}
        <div className="md:hidden flex-1 flex items-center min-w-0 overflow-hidden pl-1">
          <div
            className="flex items-center gap-2 min-w-0 overflow-hidden transition-[width,opacity] duration-300 ease-out"
            style={{
              width: isExpanded ? "100%" : "0%",
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div className="w-full min-w-0 shrink overflow-hidden">
              <SearchAutocomplete onClose={handleClose} />
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              aria-label="Хайлт хаах"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Icon button */}
      <button
        onClick={handleOpen}
        className="hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all duration-200"
        aria-label="Хайлт нээх"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Mobile: Icon button - opens inline expanding bar */}
      <button
        onClick={handleOpen}
        className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shrink-0"
        aria-label="Хайлт нээх"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </>
  );
}
