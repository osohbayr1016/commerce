"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";
import OrderHistory from "@/components/Profile/OrderHistory";
import Wishlist from "@/components/Profile/Wishlist";
import LanguageSelector from "@/components/Profile/LanguageSelector";
import ReferralSection from "@/components/Profile/ReferralSection";
import CoinPurchase from "@/components/Profile/CoinPurchase";
import PromoCodeManager from "@/components/Profile/PromoCodeManager";
import ReferralStats from "@/components/Profile/ReferralStats";
import BackButton from "@/components/ui/BackButton";
import SpinWheel from "@/components/Spin/SpinWheel";

type TabType =
  | "orders"
  | "wishlist"
  | "settings"
  | "referral"
  | "coins"
  | "promo"
  | "spin";

export default function ProfilePageContent() {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("orders");

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (
      tab &&
      [
        "orders",
        "wishlist",
        "settings",
        "referral",
        "coins",
        "promo",
        "spin",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1">
          <ProfileSkeleton />
        </main>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getDiscountPercent = () => profile.tier_level * 5;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-white">
        <section className="py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <BackButton />
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                {t("profile.title")}
              </h1>
              <p className="mt-2 text-gray-600">{t("profile.personalInfo")}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || "User"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
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
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-xl border border-gray-200 px-4 py-3">
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {profile.tier_level || 2}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 px-4 py-3">
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {profile.xp || 1000} XP
                    </p>
                  </div>
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                    <p className="text-xs text-gray-500">Монет</p>
                    <p className="text-lg font-semibold text-yellow-600">
                      {profile.coin_balance?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 px-4 py-3">
                    <p className="text-xs text-gray-500">
                      {t("products.discount")}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {getDiscountPercent()}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-2 border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "orders"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t("profile.orderHistory")}
                </button>
                <button
                  onClick={() => setActiveTab("coins")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "coins"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  💰 Монет
                </button>
                <button
                  onClick={() => setActiveTab("spin")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "spin"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🎰 Spin Wheel
                </button>
                <button
                  onClick={() => setActiveTab("promo")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "promo"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🎁 Promo Code
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "wishlist"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t("profile.wishlist")}
                </button>
                <button
                  onClick={() => setActiveTab("referral")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "referral"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Referrals
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
                    activeTab === "settings"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t("profile.accountSettings")}
                </button>
              </div>

              {activeTab === "orders" && <OrderHistory />}
              {activeTab === "coins" && <CoinPurchase />}
              {activeTab === "spin" && <SpinWheel />}
              {activeTab === "promo" && (
                <div className="space-y-6">
                  <PromoCodeManager />
                  <ReferralStats />
                </div>
              )}
              {activeTab === "wishlist" && <Wishlist />}
              {activeTab === "referral" && <ReferralSection />}
              {activeTab === "settings" && <LanguageSelector />}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
