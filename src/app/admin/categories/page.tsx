"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category, getErrorMessage } from "@/types";

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
  });
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    });
    setEditing(null);
  }

  function handleEdit(category: Category) {
    setEditing(category.id);
    setFormData({
      name: category.name,
      name_en: category.name_en || "",
      name_mn: category.name_mn || "",
      slug: category.slug,
      is_active: category.is_active ?? true,
      display_order: category.display_order || 0,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      if (editing) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            name_en: formData.name_en,
            name_mn: formData.name_mn,
            slug: formData.slug,
            is_active: formData.is_active,
            display_order: formData.display_order,
          })
          .eq("id", editing);

        if (error) throw error;
        setMessage("Ангилал амжилттай шинэчлэгдлээ!");
      } else {
        // Create new category
        const { error } = await supabase.from("categories").insert([
          {
            name: formData.name,
            name_en: formData.name_en,
            name_mn: formData.name_mn,
            slug: formData.slug,
            is_active: formData.is_active,
            display_order: formData.display_order,
          },
        ]);

        if (error) throw error;
        setMessage("Ангилал амжилттай нэмэгдлээ!");
      }

      resetForm();
      fetchCategories();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving category:", error);
      setMessage(`Алдаа гарлаа: ${getErrorMessage(error)}`);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Та энэ ангилалыг устгахдаа итгэлтэй байна уу?")) {
      return;
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      setMessage("Ангилал амжилттай устгагдлаа!");
      fetchCategories();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage(`Алдаа гарлаа: ${getErrorMessage(error)}`);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-600">Ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Ангилал</h1>
        <p className="text-base text-gray-600">Ангилалуудыг удирдах</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-4">
              {editing ? "Ангилал засах" : "Шинэ ангилал"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Нэр *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Нэр (Англи)
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Нэр (Монгол)
                </label>
                <input
                  type="text"
                  value={formData.name_mn}
                  onChange={(e) =>
                    setFormData({ ...formData, name_mn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="women-boots"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Эрэмбэ
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
                />
                <label className="ml-2 text-sm font-medium text-black">
                  Идэвхитэй
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  {editing ? "Шинэчлэх" : "Нэмэх"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Цуцлах
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.includes("амжилттай")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Нэр
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Төлөв
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      {category.name_mn && (
                        <div className="text-sm text-gray-500">
                          {category.name_mn}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.is_active ? "Идэвхитэй" : "Идэвхгүй"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-gray-700 hover:text-gray-900 font-medium"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {categories.length === 0 && (
              <div className="p-12 text-center text-gray-600">
                Ангилал байхгүй байна
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
