"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";
import OrderHistory from "@/components/Profile/OrderHistory";
import Wishlist from "@/components/Profile/Wishlist";
import LanguageSelector from "@/components/Profile/LanguageSelector";
import ReferralSection from "@/components/Profile/ReferralSection";
import CoinPurchase from "@/components/Profile/CoinPurchase";
import PromoCodeManager from "@/components/Profile/PromoCodeManager";
import ReferralStats from "@/components/Profile/ReferralStats";
import UserInfo from "@/components/Profile/UserInfo";
import Image from "next/image";
import Link from "next/link";

type TabType =
  | "overview"
  | "orders"
  | "wishlist"
  | "settings"
  | "referral"
  | "coins"
  | "promo";

const NAV_ITEMS: Array<{
  id: TabType;
  label: string;
  labelKey: string;
  icon: React.ReactNode;
}> = [
  {
    id: "overview",
    label: "Overview",
    labelKey: "profile.overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Orders",
    labelKey: "profile.orderHistory",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: "wishlist",
    label: "Wishlist",
    labelKey: "profile.wishlist",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "coins",
    label: "Coins",
    labelKey: "profile.coins",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "promo",
    label: "Promo & Referral",
    labelKey: "profile.promo",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    id: "referral",
    label: "Referrals",
    labelKey: "profile.referrals",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    labelKey: "profile.accountSettings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ProfilePageContent() {
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (
      tab &&
      ["overview", "orders", "wishlist", "settings", "referral", "coins", "promo"].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch {
      // silently fail
    }
  };

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
    return (
      <div className="min-h-screen bg-white">
        <main className="py-20">
          <section className="mx-auto max-w-lg px-4 sm:px-6">
            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t("profile.title")}</h1>
              <p className="mt-2 text-gray-500 text-sm">
                Sign in to view your orders, wishlist, coins, and level.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Create account
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const tierLevel = profile.tier_level || 1;
  const xp = profile.xp || 0;
  const xpPerLevel = 1000;
  const currentLevelXp = (tierLevel - 1) * xpPerLevel;
  const nextLevelXp = tierLevel * xpPerLevel;
  const progress = Math.min(100, Math.max(0, ((xp - currentLevelXp) / xpPerLevel) * 100));
  const discountPercent = tierLevel * 5;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* ── Mobile Navigation Header ── */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{activeNavItem?.label || "My Account"}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Lv.{tierLevel}</span>
              <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="" width={32} height={32} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-600">
                    {profile.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Dropdown Nav */}
          {mobileNavOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={() => setMobileNavOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white shadow-xl">
                <div className="px-2 py-2 max-h-[70vh] overflow-y-auto">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Desktop Layout ── */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex gap-8">
            {/* ── Sidebar (Desktop) ── */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* User Card */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
                      {profile.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.full_name || "User"}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-600">
                          {profile.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      {/* Level badge */}
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[9px] font-bold text-white ring-2 ring-white">
                        {tierLevel}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {profile.full_name || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">Level {tierLevel}</span>
                      <span className="font-semibold text-gray-900">{xp} / {nextLevelXp} XP</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-900"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white border border-gray-100 p-2.5 text-center">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">XP</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{xp}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-gray-100 p-2.5 text-center">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Coins</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{profile.coin_balance || 0}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-gray-100 p-2.5 text-center">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Off</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{discountPercent}%</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="pt-4">
                  <div className="space-y-0.5">
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className={activeTab === item.id ? "text-white" : "text-gray-400"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* ── Main Content ── */}
            <section className="min-w-0 flex-1">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  {activeNavItem?.label || "My Account"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "overview" && "Welcome back! Here's a summary of your account."}
                  {activeTab === "orders" && "Track and manage your recent orders."}
                  {activeTab === "wishlist" && "Items you've saved for later."}
                  {activeTab === "coins" && "Your coin balance and purchase history."}
                  {activeTab === "promo" && "Manage your promo code and track referral discounts."}
                  {activeTab === "referral" && "Invite friends and earn rewards."}
                  {activeTab === "settings" && "Manage your account preferences."}
                </p>
              </div>

              {/* ── Tab Content ── */}
              <div className="profile-animate-in">
                {activeTab === "overview" && (
                  <OverviewTab
                    profile={profile}
                    email={user.email || ""}
                    xp={xp}
                    tierLevel={tierLevel}
                    progress={progress}
                    nextLevelXp={nextLevelXp}
                    discountPercent={discountPercent}
                    onNavigate={handleTabChange}
                  />
                )}
                {activeTab === "orders" && <OrderHistory />}
                {activeTab === "wishlist" && <Wishlist />}
                {activeTab === "coins" && <CoinPurchase />}
                {activeTab === "promo" && (
                  <div className="space-y-6">
                    <PromoCodeManager />
                    <ReferralStats />
                  </div>
                )}
                {activeTab === "referral" && <ReferralSection />}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <UserInfo />
                    <LanguageSelector />
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
      Overview Tab – Dashboard-style summary
   ───────────────────────────────────────────── */
import type { Profile } from "@/types";

function OverviewTab({
  profile,
  email,
  xp,
  tierLevel,
  progress,
  nextLevelXp,
  discountPercent,
  onNavigate,
}: {
  profile: Profile;
  email: string;
  xp: number;
  tierLevel: number;
  progress: number;
  nextLevelXp: number;
  discountPercent: number;
  onNavigate: (tab: TabType) => void;
}) {
  const quickLinks: Array<{
    id: TabType;
    title: string;
    desc: string;
  }> = [
    { id: "orders", title: "My Orders", desc: "View and track your orders" },
    { id: "wishlist", title: "Wishlist", desc: "Saved items you love" },
    { id: "coins", title: "Coins", desc: `Balance: ${(profile.coin_balance || 0).toLocaleString()}` },
    { id: "referral", title: "Referrals", desc: "Invite friends, earn rewards" },
    { id: "promo", title: "Promo Code", desc: profile.promo_code || "Create your code" },
    { id: "settings", title: "Settings", desc: "Account & language" },
  ];

  return (
    <div className="space-y-10">
      {/* User Header — white, minimal */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50 sm:h-20 sm:w-20">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
                  {profile.full_name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {profile.full_name || "Welcome"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{email}</p>
              <p className="mt-1.5 text-xs text-gray-400 tracking-wide uppercase">
                Level {tierLevel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center sm:text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">XP</p>
              <p className="text-lg font-semibold text-gray-900">{xp.toLocaleString()}</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Coins</p>
              <p className="text-lg font-semibold text-gray-900">{(profile.coin_balance || 0).toLocaleString()}</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Discount</p>
              <p className="text-lg font-semibold text-gray-900">{discountPercent}%</p>
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Level {tierLevel}</span>
            <span>{nextLevelXp - xp} XP to next level</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-px sm:grid-cols-3 border border-gray-200 rounded-lg overflow-hidden">
        {quickLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className="group flex flex-col items-start bg-white p-5 text-left transition-colors duration-200 hover:bg-gray-50"
          >
            <p className="text-sm font-semibold text-gray-900">
              {link.title}
            </p>
            <p className="mt-1 text-xs text-gray-400 line-clamp-1">{link.desc}</p>
          </button>
        ))}
      </div>

      {/* Membership Perks */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Your Benefits</h3>
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          <div className="pr-6 py-2">
            <p className="text-sm font-semibold text-gray-900">{discountPercent}% off</p>
            <p className="text-xs text-gray-400 mt-0.5">Member discount</p>
          </div>
          <div className="pr-6 py-2">
            <p className="text-sm font-semibold text-gray-900">Priority</p>
            <p className="text-xs text-gray-400 mt-0.5">Early access</p>
          </div>
          <div className="pr-6 py-2">
            <p className="text-sm font-semibold text-gray-900">Coin rewards</p>
            <p className="text-xs text-gray-400 mt-0.5">Earn on orders</p>
          </div>
          <div className="pr-6 py-2">
            <p className="text-sm font-semibold text-gray-900">Spin wheel</p>
            <p className="text-xs text-gray-400 mt-0.5">Win products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
