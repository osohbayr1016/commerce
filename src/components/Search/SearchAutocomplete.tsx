"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  nameMn?: string;
  brand: string;
  price: number;
  image: string | null;
}

interface SearchAutocompleteProps {
  onClose?: () => void;
  initialQuery?: string;
}

export default function SearchAutocomplete({ onClose, initialQuery = "" }: SearchAutocompleteProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setIsOpen(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const slug = generateSlug(`${result.brand} ${result.name}`, result.id);
    router.push(`/products/${slug}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setResults([]);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim().length >= 2) {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        } else if (query.trim().length >= 2) {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setResults([]);
        onClose?.();
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const item = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 || query.length >= 2) setIsOpen(true);
          }}
          placeholder="Бүтээгдэхүүн хайх..."
          className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              if (inputRef.current) inputRef.current.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </form>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <div
            ref={resultsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Хайж байна...
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? "bg-gray-50" : ""
                    } ${index === 0 ? "rounded-t-lg" : ""} ${
                      index === results.length - 1 ? "rounded-b-lg" : ""
                    }`}
                  >
                    {result.image ? (
                      <div className="w-12 h-12 rounded border border-gray-200 flex-shrink-0 overflow-hidden relative">
                        <Image
                          src={result.image}
                          alt={result.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </p>
                      {result.nameMn && (
                        <p className="text-xs text-gray-500 truncate">
                          {result.nameMn}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-0.5">
                        {result.brand && `${result.brand} • `}
                        {new Intl.NumberFormat("mn-MN").format(result.price)} ₮
                      </p>
                    </div>
                  </button>
                ))}
              </>
            ) : query.length >= 2 ? (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                <p>Илэрц олдсонгүй</p>
                <p className="text-xs mt-1 text-gray-400">
                  "{query}" гэсэн хайлтаар бүтээгдэхүүн олдсонгүй
                </p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
