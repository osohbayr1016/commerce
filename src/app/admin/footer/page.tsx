"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/types";
import { getDefaultFooterRows, type FooterContentRow } from "@/lib/footer-defaults";

export default function FooterPage() {
  const [contents, setContents] = useState<FooterContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    section: "",
    key: "",
    value: "",
    display_order: 0,
    is_active: true,
  });
  const [message, setMessage] = useState("");
  const [tableMissing, setTableMissing] = useState(false);

  const supabase = createClient();

  const fetchContents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("footer_contents")
        .select("*")
        .order("section", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) {
        const msg = getErrorMessage(error);
        if (msg.includes("schema cache") || msg.includes("does not exist")) {
          setTableMissing(true);
          setContents(getDefaultFooterRows());
        } else {
          setMessage(`Error: ${msg}`);
        }
        return;
      }
      setTableMissing(false);
      setContents(data || []);
      setMessage("");
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
      setTableMissing(true);
      setContents(getDefaultFooterRows());
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  function resetForm() {
    setFormData({
      section: "",
      key: "",
      value: "",
      display_order: 0,
      is_active: true,
    });
    setEditing(null);
    setMessage("");
  }

  function handleFormChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleEdit(content: FooterContentRow) {
    setFormData({
      section: content.section,
      key: content.key,
      value: content.value,
      display_order: content.display_order,
      is_active: content.is_active,
    });
    setEditing(content.id);
    setMessage("");
  }

  async function handleSubmit() {
    if (tableMissing) {
      setMessage("Хүснэгт байхгүй тул хадгалах боломжгүй. Migration ажиллуулна уу.");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("footer_contents")
          .update({
            value: formData.value,
            display_order: formData.display_order,
            is_active: formData.is_active,
          })
          .eq("id", editing);
        if (error) throw error;
        setMessage("Footer content updated successfully");
      } else {
        const { error } = await supabase
          .from("footer_contents")
          .insert([formData]);
        if (error) throw error;
        setMessage("Footer content created successfully");
      }
      resetForm();
      await fetchContents();
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (tableMissing) return;
    try {
      const { error } = await supabase
        .from("footer_contents")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setMessage("Footer content deleted successfully");
      await fetchContents();
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
    }
  }

  const sections = ["company", "social", "help_menu", "contact", "bottom_links"];
  const groupedContents = sections.map((section) => ({
    section,
    items: contents.filter((c) => c.section === section),
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Footer удирдах
        </h1>
        <p className="text-base text-gray-600">
          Footer агуулга нэмэх, засах, устгах
        </p>
      </div>

      {tableMissing && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <strong>footer_contents</strong> хүснэгт олдсонгүй. Supabase Dashboard → SQL Editor-ээр доорх SQL ажиллуулбал footer засварлагдах болно.
        </div>
      )}
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

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editing ? "Footer агуулга засах" : "Шинэ footer агуулга нэмэх"}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => handleFormChange("section", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!!editing}
                required
              >
                <option value="">Select section</option>
                {sections.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => handleFormChange("key", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!!editing}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <textarea
                value={formData.value}
                onChange={(e) => handleFormChange("value", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
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
                  handleFormChange("display_order", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleFormChange("is_active", e.target.checked)}
                className="rounded border-gray-300"
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || tableMissing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {groupedContents.map(({ section, items }) => (
        <div key={section} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {section.replace("_", " ")}
          </h3>
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items in this section</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Key
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.key}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {item.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.display_order}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={tableMissing}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
