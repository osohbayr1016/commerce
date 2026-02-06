"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import AdminSkeleton from "@/components/ui/skeletons/AdminSkeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      // Handle error
    }
  };

  const navLinks = [
    { href: "/admin", label: "Хянах самбар", icon: "📊" },
    { href: "/admin/products", label: "Бүтээгдэхүүн", icon: "📦" },
    { href: "/admin/categories", label: "Ангилал", icon: "🏷️" },
    { href: "/admin/orders", label: "Захиалга", icon: "🛒" },
    { href: "/admin/users", label: "Хэрэглэгч", icon: "👥" },
    { href: "/admin/referral/top6", label: "Top 6", icon: "⭐" },
    {
      href: "/admin/referral/analytics",
      label: "Referral Analytics",
      icon: "📈",
    },
    { href: "/admin/referral/network", label: "Referral Network", icon: "🌐" },
    { href: "/admin/spin", label: "Spin Wheel", icon: "🎰" },
    { href: "/admin/hero", label: "Banner", icon: "🖼️" },
    { href: "/admin/footer", label: "Footer", icon: "📄" },
    { href: "/admin/settings", label: "Тохиргоо", icon: "⚙️" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (loading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-lg font-semibold text-gray-900">
            Admin
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Overlay - fades in, tap to close */}
      <div
        role="button"
        tabIndex={-1}
        onClick={closeMobileMenu}
        onKeyDown={(e) => e.key === "Escape" && closeMobileMenu()}
        aria-hidden={!mobileMenuOpen}
        className={`lg:hidden fixed inset-0 z-40 bg-gray-900/25 transition-opacity duration-300 ease-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar - sliding drawer with explicit animation */}
      <aside
        className="admin-drawer fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shrink-0 shadow-xl lg:shadow-none"
        style={{
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 border-b border-gray-200">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

          </nav>

          {/* User Info & Actions */}
          <div className="border-t border-gray-200 p-4">
            {user && profile && (
              <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm">
                    {profile.full_name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile.full_name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profile.role === "admin" ? "Админ" : "Хэрэглэгч"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                handleSignOut();
                closeMobileMenu();
              }}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left mb-2"
            >
              Гарах
            </button>

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              ← Вэбсайт руу
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen pt-16 lg:pt-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
