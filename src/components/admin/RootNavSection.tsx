"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { getLocalizedName } from "@/lib/localize";
import CategoryNameInputs from "./CategoryNameInputs";

interface RootNavSectionProps {
  roots: Category[];
  subCounts: Map<number, number>;
  onAdd: (data: RootFormData) => Promise<void>;
  onEdit: (id: number, data: RootFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading: boolean;
}

export interface RootFormData {
  name: string;
  name_en: string;
  name_mn: string;
  name_ru: string;
  name_zh: string;
  name_it: string;
  slug: string;
  display_order: number;
}

export default function RootNavSection({
  roots,
  subCounts,
  onAdd,
  onEdit,
  onDelete,
  loading,
}: RootNavSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RootFormData>({
    name: "",
    name_en: "",
    name_mn: "",
    name_ru: "",
    name_zh: "",
    name_it: "",
    slug: "",
    display_order: roots.length,
  });

  const editing = editingId ? roots.find((r) => r.id === editingId) : null;

  function resetForm() {
    setFormData({
      name: "",
      name_en: "",
      name_mn: "",
      name_ru: "",
      name_zh: "",
      name_it: "",
      slug: "",
      display_order: roots.length,
    });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setFormData({
      name: c.name || "",
      name_en: c.name_en || "",
      name_mn: c.name_mn || "",
      name_ru: c.name_ru || "",
      name_zh: c.name_zh || "",
      name_it: c.name_it || "",
      slug: c.slug,
      display_order: c.display_order ?? 0,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await onEdit(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch {}
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Nav ангилал (header дээр харагдах)
        </h2>
        {!showForm && !editingId && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            + Нэмэх
          </button>
        )}
      </div>

      {(showForm || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="mb-4">
            <CategoryNameInputs
              values={formData as unknown as Record<string, string | number>}
              onChange={(key, value) =>
                setFormData((p) => ({ ...p, [key]: value }))
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, slug: e.target.value }))
                }
                placeholder="male, female, kids"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    display_order: Number(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
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

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Нэр
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дэд
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roots.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {getLocalizedName(r, "mn") || r.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{r.slug}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {subCounts.get(r.id) ?? 0}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link
                    href={`/categories/${r.slug}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Хуудас
                  </Link>
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Засах
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="text-red-600 hover:underline"
                  >
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <p className="text-gray-700 mb-4">
              {(subCounts.get(confirmDeleteId) ?? 0) > 0
                ? "Дэд ангилалтай бол устгах боломжгүй. Эхлээд дэд ангилалуудыг устгана уу."
                : "Устгахдаа итгэлтэй байна уу?"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 bg-gray-200 rounded-lg font-medium"
              >
                Болих
              </button>
              {(subCounts.get(confirmDeleteId) ?? 0) === 0 && (
                <button
                  onClick={async () => {
                    await onDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium"
                >
                  Устгах
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
