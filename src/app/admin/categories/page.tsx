"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types";
import NavCategorySection, {
  type SubcategoryData,
} from "@/components/admin/NavCategorySection";
import RootNavSection, {
  type RootFormData,
} from "@/components/admin/RootNavSection";

export default function CategoriesPage() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(
          "id, name, name_en, name_mn, name_ru, name_zh, name_it, slug, parent_id, level, display_order",
        )
        .order("display_order", { ascending: true });
      if (error) throw error;
      setAllCategories((data || []) as Category[]);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rootCategories = allCategories.filter((c) => c.parent_id == null);
  const subCounts = new Map<number, number>();
  rootCategories.forEach((r) => {
    subCounts.set(
      r.id,
      allCategories.filter((c) => c.parent_id === r.id).length,
    );
  });

  function getSubcategories(parentId: number) {
    return allCategories.filter((c) => c.parent_id === parentId);
  }

  async function handleAddRoot(data: RootFormData): Promise<void> {
    const name =
      data.name_en ||
      data.name_mn ||
      data.name_ru ||
      data.name_zh ||
      data.name_it ||
      data.name ||
      "";
    const { error } = await supabase.from("categories").insert({
      name,
      name_en: data.name_en || null,
      name_mn: data.name_mn || null,
      name_ru: data.name_ru || null,
      name_zh: data.name_zh || null,
      name_it: data.name_it || null,
      slug: data.slug,
      display_order: data.display_order,
      parent_id: null,
      level: 1,
      is_active: true,
    });
    if (error) throw new Error(error.message);
    setMessage("Nav ангилал нэмэгдлээ");
    await fetchData();
  }

  async function handleEditRoot(id: number, data: RootFormData): Promise<void> {
    const name =
      data.name_en ||
      data.name_mn ||
      data.name_ru ||
      data.name_zh ||
      data.name_it ||
      data.name ||
      "";
    const payload = {
      name,
      name_en: data.name_en || null,
      name_mn: data.name_mn || null,
      name_ru: data.name_ru || null,
      name_zh: data.name_zh || null,
      name_it: data.name_it || null,
      slug: data.slug,
      display_order: data.display_order,
    };
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Алдаа");
    setMessage("Ангилал шинэчлэгдлээ");
    await fetchData();
  }

  async function handleDeleteRoot(id: number): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Алдаа");
    setMessage("Ангилал устгагдлаа");
    await fetchData();
  }

  async function handleAddSubcategory(
    parentId: number,
    data: SubcategoryData,
  ): Promise<void> {
    const { error } = await supabase.from("categories").insert({
      ...data,
      parent_id: parentId,
      level: 2,
      is_active: true,
    });
    if (error) throw new Error(error.message);
    setMessage("Дэд ангилал нэмэгдлээ");
    await fetchData();
  }

  async function handleEditSubcategory(
    id: number,
    data: SubcategoryData,
  ): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Алдаа");
    setMessage("Ангилал шинэчлэгдлээ");
    await fetchData();
  }

  async function handleDeleteSubcategory(id: number): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Алдаа");
    setMessage("Ангилал устгагдлаа");
    await fetchData();
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Ангилал удирдах
        </h1>
        <p className="text-gray-600">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Ангилал удирдах
        </h1>
        <p className="text-base text-gray-600">
          Nav ангилал болон дэд ангилалуудыг удирдах
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800">
          {message}
        </div>
      )}

      <RootNavSection
        roots={rootCategories}
        subCounts={subCounts}
        onAdd={handleAddRoot}
        onEdit={handleEditRoot}
        onDelete={handleDeleteRoot}
        loading={loading}
      />

      <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
        Дэд ангилал
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rootCategories.map((cat) => (
          <NavCategorySection
            key={cat.id}
            category={cat}
            subcategories={getSubcategories(cat.id)}
            onAddSubcategory={handleAddSubcategory}
            onEditSubcategory={handleEditSubcategory}
            onDeleteSubcategory={handleDeleteSubcategory}
            loading={loading}
          />
        ))}
      </div>

      {rootCategories.length === 0 && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg mt-4">
          <p className="text-amber-800">
            Nav ангилал байхгүй. Дээрх &quot;+ Нэмэх&quot; товч дарж нэмнэ үү.
          </p>
        </div>
      )}
    </div>
  );
}
