"use client";

import { LANGUAGES } from "@/lib/localize";

const LABELS: Record<string, string> = {
  en: "Нэр (English) *",
  mn: "Нэр (Монгол) *",
  ru: "Нэр (Орос)",
  zh: "Нэр (Хятад)",
  it: "Нэр (Итали)",
};

interface ProductFormNameSectionProps {
  values: Record<string, string | number | boolean>;
  onChange: (name: string, value: string) => void;
}

export default function ProductFormNameSection({
  values,
  onChange,
}: ProductFormNameSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {LANGUAGES.map((lang) => (
        <div key={lang}>
          <label className="block text-base font-semibold text-black mb-2">
            {LABELS[lang]}
          </label>
          <input
            type="text"
            name={`name_${lang}`}
            value={String(values[`name_${lang}`] ?? "")}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            required={lang === "en" || lang === "mn"}
          />
        </div>
      ))}
    </div>
  );
}
