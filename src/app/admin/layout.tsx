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

  const navGroups = [
    {
      title: "Үндсэн Удирдлага", // Core Business Console
      links: [
        { href: "/admin", label: "Хянах самбар", icon: "dashboard" },
        { href: "/admin/orders", label: "Захиалга", icon: "orders" },
        { href: "/admin/products", label: "Бүтээгдэхүүн", icon: "products" },
        { href: "/admin/users", label: "Хэрэглэгч", icon: "users" },
      ],
    },
    {
      title: "Реферрал Сүлжээ", // Referral System
      links: [
        { href: "/admin/referral/top6", label: "Top 6 гишүүд", icon: "top6" },
        { href: "/admin/referral/analytics", label: "Урилгын аналитик", icon: "analytics" },
        { href: "/admin/referral/network", label: "Урилгын сүлжээ", icon: "network" },
      ],
    },
    {
      title: "Маркетинг & CMS", // Growth & Marketing
      links: [
        { href: "/admin/spin", label: "Spin хүрд", icon: "spin" },
        { href: "/admin/hero", label: "Banner тохиргоо", icon: "banners" },
        { href: "/admin/footer", label: "Footer тохиргоо", icon: "footer" },
      ],
    },
    {
      title: "Систем & Тохиргоо", // System & Categorization
      links: [
        { href: "/admin/categories", label: "Ангилал", icon: "categories" },
        { href: "/admin/types", label: "Төрөл удирдах", icon: "types" },
        { href: "/admin/settings", label: "Ерөнхий тохиргоо", icon: "settings" },
      ],
    },
  ];

  const renderIcon = (name: string) => {
    switch (name) {
      case "dashboard":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case "orders":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case "products":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case "users":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "top6":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case "analytics":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
        );
      case "network":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        );
      case "spin":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "banners":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "footer":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "categories":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.16 3.659A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
        );
      case "types":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
      case "settings":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (loading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-[#0c0c0d] border-b border-[#1f2022] z-50 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-md font-semibold tracking-wider font-heading text-neutral-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            MaayaaUvuu Console
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar - sliding drawer (Obsidian-Dark theme) */}
      <aside
        className="admin-drawer fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-[#0c0c0d] border-r border-[#1e1f21] shrink-0 shadow-2xl lg:shadow-none flex flex-col text-neutral-300"
        style={{
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Desktop Sidebar Logo */}
        <div className="hidden lg:flex p-6 border-b border-[#1e1f21] items-center justify-between">
          <Link href="/" className="text-base font-semibold tracking-widest font-heading text-neutral-100 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            MaayaaUvuu
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-6 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <h4 className="text-[10px] font-bold tracking-widest text-[#696b70] uppercase px-3 mb-2">
                {group.title}
              </h4>
              <div className="space-y-0.5">
                {group.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-3 py-2 text-xs sm:text-[13px] font-medium font-heading rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-neutral-800 text-amber-200 border-l-[3px] border-amber-400 pl-2.5"
                          : "hover:bg-neutral-900/60 hover:text-neutral-100 border-l-[3px] border-transparent"
                      }`}
                    >
                      {renderIcon(link.icon)}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info & Pulse Operational status */}
        <div className="border-t border-[#1e1f21] p-4 bg-[#080809]">
          {user && profile && (
            <div className="mb-4 px-3 py-2.5 bg-neutral-900/50 rounded-lg border border-[#1f2022]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-semibold text-xs shrink-0">
                  {profile.full_name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-100 truncate">
                    {profile.full_name || "Admin"}
                  </p>
                  <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mt-0.5">
                    {profile.role === "admin" ? "Системийн админ" : "Хэрэглэгч"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pulsing Platform Status */}
          <div className="flex items-center justify-between px-3 py-2 bg-neutral-950/60 border border-[#18191b] rounded-md mb-4 text-[10px] text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              Систем хэвийн
            </span>
            <span className="text-[9px] text-neutral-600 font-mono">QPAY Live</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                handleSignOut();
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400/90 hover:bg-red-950/20 hover:text-red-300 rounded-md transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Гарах
            </button>

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Вэбсайт руу буцах
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Visual Top Command Header */}
        <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4">
          {/* Simulated Search Bar */}
          <div className="relative max-w-md w-full hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Гүйлгээ, хэрэглэгч эсвэл захиалга хайх..."
              className="w-full bg-neutral-50/70 border border-neutral-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-sans"
            />
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span className="text-xs font-semibold text-neutral-800 font-heading tracking-wider">MaayaaUvuu Console</span>
          </div>

          {/* Right Tools - Time and User badge */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Live Clock / Environment indicator */}
            <span className="text-[11px] font-semibold text-neutral-500 font-mono bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm uppercase tracking-wide hidden sm:inline-block">
              Environment: Live
            </span>
            <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>
            {/* User initial circle */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-white text-[11px] font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-[13px] font-medium text-neutral-700 hidden lg:inline">
                {profile?.full_name || "Админ"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10 pt-20 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
