"use client";

import { FOOTER_BLOCKS } from "@/lib/footer-defaults";

function mapKey(section: string, key: string) {
  return `${section}:${key}`;
}

const SECTION_LABELS: Record<string, string> = {
  company: "Компани",
  social: "Сошиал",
  help_menu: "Туслах цэс",
  contact: "Холбоо барих",
  bottom_links: "Доод холбоосууд",
};

type Props = {
  values: Record<string, string>;
  loading: boolean;
  saving: boolean;
  tableMissing: boolean;
  onChange: (section: string, key: string, value: string) => void;
  onSave: () => void;
};

export function FooterBlocksForm({
  values,
  loading,
  saving,
  tableMissing,
  onChange,
  onSave,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="space-y-6">
        {["company", "social", "help_menu", "contact", "bottom_links"].map(
          (section) => {
            const blocks = FOOTER_BLOCKS.filter((b) => b.section === section);
            if (blocks.length === 0) return null;
            return (
              <div key={section}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {SECTION_LABELS[section]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blocks.map((b) => (
                    <div key={b.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {b.title}
                      </label>
                      <input
                        type="text"
                        value={values[mapKey(b.section, b.key)] ?? ""}
                        onChange={(e) =>
                          onChange(b.section, b.key, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          },
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={onSave}
          disabled={loading || saving || tableMissing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Хадгалж байна..." : "Хадгалах"}
        </button>
      </div>
    </div>
  );
}
