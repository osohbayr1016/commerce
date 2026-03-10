"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import Link from "next/link";
import { getLocalizedName } from "@/lib/localize";
import CategoryNameInputs from "./CategoryNameInputs";

interface NavCategorySectionProps {
  category: Category;
  subcategories: Category[];
  onAddSubcategory: (parentId: number, data: SubcategoryData) => Promise<void>;
  onEditSubcategory: (id: number, data: SubcategoryData) => Promise<void>;
  onDeleteSubcategory: (id: number) => Promise<void>;
  loading: boolean;
}

export interface SubcategoryData {
  name: string;
  name_en: string;
  name_mn: string;
  name_ru: string;
  name_zh: string;
  name_it: string;
  slug: string;
  display_order: number;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function NavCategorySection({
  category,
  subcategories,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  loading,
}: NavCategorySectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({
    name_en: "",
    name_mn: "",
    name_ru: "",
    name_zh: "",
    name_it: "",
    slug: "",
  });

  const editing = editingId ? subcategories.find((c) => c.id === editingId) : null;

  useEffect(() => {
    if (editing) {
      setFormData({
        name_en: editing.name_en || "",
        name_mn: editing.name_mn || "",
        name_ru: editing.name_ru || "",
        name_zh: editing.name_zh || "",
        name_it: editing.name_it || "",
        slug: editing.slug || "",
      });
    }
  }, [editing]);

  function resetForm() {
    setFormData({
      name_en: "",
      name_mn: "",
      name_ru: "",
      name_zh: "",
      name_it: "",
      slug: "",
    });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setFormData({
      name_en: c.name_en || "",
      name_mn: c.name_mn || "",
      name_ru: c.name_ru || "",
      name_zh: c.name_zh || "",
      name_it: c.name_it || "",
      slug: c.slug || "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name =
      formData.name_en?.trim() ||
      formData.name_mn?.trim() ||
      formData.name_ru?.trim() ||
      formData.name_zh?.trim() ||
      formData.name_it?.trim() ||
      "";
    const data: SubcategoryData = {
      name,
      name_en: formData.name_en?.trim() || "",
      name_mn: formData.name_mn?.trim() || "",
      name_ru: formData.name_ru?.trim() || "",
      name_zh: formData.name_zh?.trim() || "",
      name_it: formData.name_it?.trim() || "",
      slug: formData.slug?.trim() || toSlug(name),
      display_order: 0,
    };
    try {
      if (editingId) {
        await onEditSubcategory(editingId, data);
      } else {
        await onAddSubcategory(category.id, data);
      }
      resetForm();
    } catch {}
  }

  const displayName = getLocalizedName(category, "mn") || category.name;
  const sorted = [...subcategories].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
          <p className="text-xs text-gray-500">/categories/{category.slug}</p>
        </div>
        <Link
          href={`/categories/${category.slug}`}
          className="text-sm text-blue-600 hover:underline"
        >
          Хуудас →
        </Link>
      </div>

      <div className="space-y-2 mb-4 min-h-[60px]">
        {sorted.length === 0 && !showForm && !editingId ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-lg">
            Дэд ангилал байхгүй
          </p>
        ) : (
          sorted.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium">
                {getLocalizedName(sub, "mn") || sub.name}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(sub)}
                  className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                >
                  Засах
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(sub.id)}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  Устгах
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleSubmit} className="p-4 bg-blue-50 rounded-lg space-y-3">
          <CategoryNameInputs
            values={formData as unknown as Record<string, string | number>}
            onChange={(key, value) =>
              setFormData((p) => ({ ...p, [key]: value }))
            }
          />
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL (slug)
            </label>
            <input
              type="text"
              value={formData.slug ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, slug: e.target.value }))
              }
              placeholder="boots, bags, shoes"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              {editingId ? "Хадгалах" : "Нэмэх"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
            >
              Цуцлах
            </button>
          </div>
        </form>
      )}

      {!showForm && !editingId && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
        >
          + Дэд ангилал нэмэх
        </button>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <p className="text-gray-700 mb-4">Устгахдаа итгэлтэй байна уу?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 bg-gray-200 rounded-lg font-medium"
              >
                Болих
              </button>
              <button
                onClick={async () => {
                  await onDeleteSubcategory(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
