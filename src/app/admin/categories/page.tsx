"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category, getErrorMessage } from "@/types";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    name_en: "",
    name_mn: "",
    slug: "",
    is_active: true,
    display_order: 0,
    show_in_header: false,
  });
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, name_en, name_mn, slug, is_active, display_order")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function resetForm() {
    setFormData({
      name: "",
      name_en: "",
      name_mn: "",
      slug: "",
      is_active: true,
      display_order: 0,
      show_in_header: false,
    });
    setEditing(null);
    setMessage("");
  }

  function handleFormChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleEdit(category: Category) {
    setFormData({
      name: category.name,
      name_en: category.name_en || "",
      name_mn: category.name_mn || "",
      slug: category.slug,
      is_active: category.is_active ?? true,
      display_order: category.display_order || 0,
      show_in_header: category.show_in_header || false,
    });
    setEditing(category.id);
    setMessage("");
  }

  function getCategoryPayload(includeShowInHeader: boolean) {
    const {
      name,
      name_en,
      name_mn,
      slug,
      is_active,
      display_order,
      show_in_header,
    } = formData;
    const payload: Record<string, unknown> = {
      name,
      name_en: name_en || null,
      name_mn: name_mn || null,
      slug,
      is_active,
      display_order,
    };
    if (includeShowInHeader) payload.show_in_header = show_in_header;
    return payload;
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      if (editing) {
        const payload = getCategoryPayload(true);
        const res = await fetch(`/api/admin/categories/${editing}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Update failed");
        setMessage("Category updated successfully");
      } else {
        const payload = getCategoryPayload(true);
        let result = await supabase.from("categories").insert([payload]);
        if (
          result.error?.message?.includes("show_in_header") &&
          result.error?.message?.includes("schema cache")
        ) {
          result = await supabase
            .from("categories")
            .insert([getCategoryPayload(false)]);
        }
        if (result.error) throw result.error;
        setMessage("Category created successfully");
      }
      resetForm();
      await fetchCategories();
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage("Category deleted successfully");
      await fetchCategories();
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
    }
  }

  async function handleToggleActive(id: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Update failed");
      await fetchCategories();
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Ангилал удирдах
        </h1>
        <p className="text-base text-gray-600">
          Бүтээгдэхүүний ангилал нэмэх, засах
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <CategoryForm
        editing={editing}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        loading={loading}
      />

      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}
