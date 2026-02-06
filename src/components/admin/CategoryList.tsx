"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => Promise<void>;
  onToggleActive: (id: number, isActive: boolean) => Promise<void>;
}

export default function CategoryList({
  categories,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: CategoryListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryToDelete =
    confirmDeleteId != null
      ? categories.find((c) => c.id === confirmDeleteId)
      : null;

  useEffect(() => {
    if (confirmDeleteId != null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmDeleteId]);

  useEffect(() => {
    if (confirmDeleteId == null) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) setConfirmDeleteId(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [confirmDeleteId, deleting]);

  const handleDoDelete = async () => {
    if (confirmDeleteId == null) return;
    setDeleting(true);
    setError(null);
    try {
      await onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгахад алдаа гарлаа");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">No categories found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Header
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                  {category.name_en && (
                    <div className="text-xs text-gray-500">
                      {category.name_en}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.display_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      onToggleActive(category.id, !category.is_active)
                    }
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.show_in_header ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDeleteId != null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-delete-title"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !deleting && setConfirmDeleteId(null)}
              aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3
                id="category-delete-title"
                className="mt-4 text-center text-lg font-semibold text-gray-900"
              >
                Ангилал устгах
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                Та &quot;{categoryToDelete?.name ?? ""}&quot; ангилалыг
                устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцааж болохгүй.
              </p>
              {error && (
                <p className="mt-2 text-center text-sm text-red-600">{error}</p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => !deleting && setConfirmDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Болих
                </button>
                <button
                  type="button"
                  onClick={handleDoDelete}
                  disabled={deleting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Устгаж байна..." : "Устгах"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
