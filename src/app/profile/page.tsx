"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import OrderHistory from "@/components/Profile/OrderHistory";
import Wishlist from "@/components/Profile/Wishlist";

type TabType = "orders" | "wishlist";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("orders");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as TabType;
    if (tab && ["orders", "wishlist"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getDiscountPercent = () => {
    // Calculate discount based on tier level
    return profile.tier_level * 5; // Example: level 2 = 10% discount
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-6">
          Хэрэглэгийн мэдээлэл
        </h1>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User info</h2>
          
          <div className="flex items-start justify-between">
            {/* Left: Avatar and basic info */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {profile.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {profile.full_name || "John Doe"}
                </h3>
                <p className="text-sm text-gray-500">
                  Имэйл: {user.email || "user@example.com"}
                </p>
                <p className="text-sm text-gray-500">
                  uett: gray {profile.tier_level * 50}
                </p>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="text-right space-y-1">
              <p className="text-sm text-gray-600">
                <span className="text-blue-600 font-medium">Түвшин:</span>{" "}
                <span className="text-blue-600">
                  Жил Name ({profile.tier_level || 1} ({profile.tier_level * 10 || 10}))
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Тивлэл = {profile.tier_level || 2}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tier Name:</span> {profile.xp || 1000} XP
              </p>
              <p className="text-sm font-semibold text-green-600">
                Хямдрал: хеат 1 {getDiscountPercent()}%
              </p>
            </div>
          </div>
        </div>

        {/* Orders and Wishlist Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 font-medium rounded-t-lg transition ${
                  activeTab === "orders"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Захиалгын түүх
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`px-4 py-2 font-medium rounded-t-lg transition ${
                  activeTab === "wishlist"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Хадгалсан (Wishlist)
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "orders" && <OrderHistory />}
          {activeTab === "wishlist" && <Wishlist />}
        </div>
      </div>
    </div>
  );
}
