"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut, isAdmin } = useAuth();
  const router = useRouter();

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
        нэвтрэх/бүртгүүлэх
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm">
          {profile?.full_name?.[0]?.toUpperCase() || "U"}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {profile?.full_name || "Хэрэглэгч"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user.user_metadata?.phone_number ||
                user.phone ||
                user.email?.replace("@phone.app", "")}
            </p>
            {isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded">
                Админ
              </span>
            )}
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              👤 Миний профайл
            </Link>
            <Link
              href="/profile?tab=orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              📦 Миний захиалга
            </Link>
            <Link
              href="/profile?tab=wishlist"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              ❤️ Хадгалсан
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Админ самбар
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Гарах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
