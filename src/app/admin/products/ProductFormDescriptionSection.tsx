"use client";

import { LANGUAGES } from "@/lib/localize";

const LABELS: Record<string, string> = {
  en: "Тайлбар (English)",
  mn: "Тайлбар (Монгол)",
  ru: "Тайлбар (Орос)",
  zh: "Тайлбар (Хятад)",
  it: "Тайлбар (Итали)",
};

interface ProductFormDescriptionSectionProps {
  values: Record<string, string | number | boolean>;
  onChange: (name: string, value: string) => void;
}

export default function ProductFormDescriptionSection({
  values,
  onChange,
}: ProductFormDescriptionSectionProps) {
  return (
    <div className="space-y-4">
      {(["en", "mn"] as const).map((lang) => (
        <div key={lang}>
          <label className="block text-base font-semibold text-black mb-2">
            {LABELS[lang]}
          </label>
          <textarea
            name={`description_${lang}`}
            value={String(values[`description_${lang}`] ?? "")}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      ))}
    </div>
  );
}
