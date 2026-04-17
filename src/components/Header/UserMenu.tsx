"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.push("/");
    } catch (error) {}
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="hidden md:inline-flex text-gray-700 hover:text-gray-900 text-sm md:text-base whitespace-nowrap font-medium"
      >
        {t("nav.signInOrSignUp")}
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none rounded-full"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 shadow-sm flex items-center justify-center text-white font-semibold text-sm transition-transform hover:scale-105">
          {profile?.full_name?.[0]?.toUpperCase() || "U"}
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-200 origin-top-right">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {profile?.full_name || t("profile.defaultUser")}
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {user.user_metadata?.phone_number ||
                user.phone ||
                user.email?.replace("@phone.app", "")}
            </p>
            {isAdmin && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white rounded-md shadow-sm">
                  {t("profile.adminBadge")}
                </span>
              </div>
            )}
          </div>

          <div className="py-2 px-2">
            <Link
              href="/profile"
              className="group flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t("profile.myProfile")}
            </Link>
            
            <Link
              href="/profile?tab=orders"
              className="group flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {t("profile.myOrders")}
            </Link>

            <Link
              href="/profile?tab=wishlist"
              className="group flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {t("profile.wishlist")}
            </Link>
            
            {isAdmin && (
              <Link
                href="/admin"
                className="group flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t("profile.adminDashboard")}
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100 py-2 px-2 mt-1">
            <button
              onClick={handleSignOut}
              className="group flex w-full items-center px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
