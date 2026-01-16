"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MainNavClient from "@/components/Header/MainNavClient";
import Footer from "@/components/Footer/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CheckoutForm, {
  CheckoutFormValues,
} from "@/components/Checkout/CheckoutForm";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import PromoCodeInput from "@/components/Checkout/PromoCodeInput";

const emptyForm: CheckoutFormValues = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

export default function CheckoutPage() {
  const { user, profile, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeId, setPromoCodeId] = useState("");
  
  const defaultValues = useMemo(
    () => ({
      ...emptyForm,
      fullName: profile?.full_name || "",
      phone: profile?.phone_number || "",
      email: user?.email || "",
    }),
    [profile, user]
  );

  const finalTotal = subtotal - promoDiscount;

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNavClient />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">Сагс хоосон байна</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <CheckoutForm
                  items={items}
                  defaultValues={defaultValues}
                  onSuccess={handleSuccess}
                />
              </div>
              <div className="lg:col-span-1 order-1 lg:order-2 space-y-4">
                <PromoCodeInput
                  orderAmount={subtotal}
                  onApply={(discountAmt, id) => {
                    setPromoDiscount(discountAmt);
                    setPromoCodeId(id);
                  }}
                />
                <CheckoutSummary
                  items={items}
                  subtotal={subtotal}
                  discount={promoDiscount}
                  total={finalTotal}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
