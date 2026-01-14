"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/types";

export default function UserInfo() {
  const { user, profile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        })
        .eq("id", user?.id);

      if (error) throw error;

      setMessage("Мэдээлэл амжилттай шинэчлэгдлээ!");
      setEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage(`Алдаа: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Хувийн мэдээлэл</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Засах
          </button>
        )}
      </div>

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

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нэр
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Утасны дугаар
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              И-мэйл
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              И-мэйл хаягийг өөрчлөх боломжгүй
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loading ? "Хадгалж байна..." : "Хадгалах"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({
                  full_name: profile?.full_name || "",
                  phone_number: profile?.phone_number || "",
                });
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Цуцлах
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Нэр</p>
            <p className="text-lg font-medium text-gray-900">
              {profile?.full_name || "Тодорхойгүй"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">И-мэйл</p>
            <p className="text-lg font-medium text-gray-900">
              {profile?.email || user?.email || "Тодорхойгүй"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Утасны дугаар</p>
            <p className="text-lg font-medium text-gray-900">
              {profile?.phone_number || "Тодорхойгүй"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Түвшин</p>
            <div className="flex items-center space-x-4">
              <p className="text-lg font-medium text-gray-900">
                Түвшин {profile?.tier_level}
              </p>
              <p className="text-sm text-gray-600">{profile?.xp} XP</p>
            </div>
          </div>

          {profile?.role === "admin" && (
            <div className="p-4 bg-gray-900 text-white rounded-lg">
              <p className="text-sm mb-1">Хандах эрх</p>
              <p className="text-lg font-medium">Администратор</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
