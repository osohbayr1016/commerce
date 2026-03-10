"use client";

import { LANGUAGES } from "@/lib/localize";

const LABELS: Record<string, string> = {
  en: "Нэр (English)",
  mn: "Нэр (Монгол)",
  ru: "Нэр (Орос)",
  zh: "Нэр (Хятад)",
  it: "Нэр (Итали)",
};

interface CategoryNameInputsProps {
  values: Record<string, string | number>;
  onChange: (key: string, value: string) => void;
}

export default function CategoryNameInputs({
  values,
  onChange,
}: CategoryNameInputsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {LANGUAGES.map((lang) => (
        <div key={lang}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LABELS[lang]}
          </label>
          <input
            type="text"
            value={String(values[`name_${lang}`] ?? "")}
            onChange={(e) => onChange(`name_${lang}`, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
