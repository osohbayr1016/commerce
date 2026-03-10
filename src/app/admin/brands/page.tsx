"use client";

import { useState, useEffect, useCallback } from "react";

interface Brand {
  id: number;
  name: string;
  display_order: number;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      if (res.ok) setBrands(Array.isArray(data) ? data : []);
      else setBrands([]);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  function resetForm() {
    setName("");
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/brands/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Алдаа");
        setMessage("Брэнд шинэчлэгдлээ");
      } else {
        const res = await fetch("/api/admin/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Алдаа");
        setMessage("Брэнд нэмэгдлээ");
      }
      resetForm();
      await fetchBrands();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Алдаа");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Алдаа");
      setMessage("Брэнд устгагдлаа");
      setConfirmDeleteId(null);
      await fetchBrands();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Алдаа");
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Брэнд</h1>
        <p className="text-gray-600">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Брэнд</h1>
          <p className="text-base text-gray-600">Брэндийн нэр нэмэх, засах</p>
        </div>
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

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Алдаа")
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      {(showForm || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Нэр
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Жишээ: Louis Vuitton"
                required
              />
            </div>
            <button
              type="submit"
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
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {b.name}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(b.id);
                      setName(b.name);
                      setShowForm(false);
                    }}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Засах
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(b.id)}
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

      {brands.length === 0 && (
        <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">
            Брэнд байхгүй. Дээрх + Нэмэх товч дарж нэмнэ үү.
          </p>
        </div>
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
                onClick={() => handleDelete(confirmDeleteId)}
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
