"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "discount";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Шинэ" },
  { value: "oldest", label: "Хуучин" },
  { value: "price_asc", label: "Үнэ: Багаас их рүү" },
  { value: "price_desc", label: "Үнэ: Ихээс бага руу" },
  { value: "popularity", label: "Алдартай" },
  { value: "discount", label: "Хямдралтай" },
];

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortOption>("newest");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sortParam = searchParams.get("sort") as SortOption;
    if (sortParam && sortOptions.some((opt) => opt.value === sortParam)) {
      setSort(sortParam);
    }
  }, [searchParams]);

  const handleSort = (value: SortOption) => {
    setSort(value);
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const currentLabel = sortOptions.find((opt) => opt.value === sort)?.label || "Шинэ";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 min-w-[200px]"
      >
        <span>{currentLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  sort === option.value
                    ? "bg-gray-50 font-medium text-gray-900"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
