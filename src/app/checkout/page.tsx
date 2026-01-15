"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import MainNavClient from "@/components/Header/MainNavClient";
import Footer from "@/components/Footer/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CheckoutForm, {
  CheckoutFormValues,
} from "@/components/Checkout/CheckoutForm";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";

const emptyForm: CheckoutFormValues = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  zip: "",
  note: "",
};

export default function CheckoutPage() {
  const { user, profile, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      ...emptyForm,
      fullName: profile?.full_name || "",
      phone: profile?.phone_number || "",
      email: user?.email || "",
    }),
    [profile, user]
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [loading, user, router]);

  const handleSuccess = () => {
    clearCart();
    router.push("/profile?tab=orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNavClient />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Захиалга баталгаажуулах
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">Сагс хоосон байна</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CheckoutForm
                  items={items}
                  defaultValues={defaultValues}
                  onSuccess={handleSuccess}
                />
              </div>
              <CheckoutSummary items={items} subtotal={subtotal} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
