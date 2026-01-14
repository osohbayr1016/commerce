"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col">
          <div className="p-6">
            <Link href="/" className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </Link>
          </div>

          <nav className="px-4 space-y-1 flex-1">
            <Link
              href="/admin"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              Хянах самбар
            </Link>

            <Link
              href="/admin/products"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              Бүтээгдэхүүн
            </Link>

            <Link
              href="/admin/categories"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              Ангилал
            </Link>

            <Link
              href="/admin/orders"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              Захиалга
            </Link>

            <Link
              href="/admin/settings"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              Тохиргоо
            </Link>

            <div className="border-t border-gray-200 my-4"></div>

            <Link
              href="/admin/seed"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              Өгөгдөл нэмэх
            </Link>
          </nav>

          {/* User Info & Actions */}
          <div className="border-t border-gray-200 p-4">
            {user && profile && (
              <div className="mb-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className=" w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium">
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
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              Гарах
            </button>

            <Link
              href="/"
              className="block px-4 py-3 text-base text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
            >
              ← Вэбсайт руу буцах
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
