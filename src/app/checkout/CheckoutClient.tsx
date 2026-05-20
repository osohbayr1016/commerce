"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm, {
  CheckoutFormValues,
} from "@/components/Checkout/CheckoutForm";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import PromoCodeInput from "@/components/Checkout/PromoCodeInput";
import DiscountSelector from "@/components/Checkout/DiscountSelector";
import BackButton from "@/components/ui/BackButton";
import CheckoutSkeleton from "@/components/ui/skeletons/CheckoutSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

const emptyForm: CheckoutFormValues = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

export default function CheckoutClient() {
  const { user, profile, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeId, setPromoCodeId] = useState("");
  const [referralDiscountPercent, setReferralDiscountPercent] = useState(0);

  const defaultValues = useMemo(
    () => ({
      ...emptyForm,
      fullName: profile?.full_name || "",
      phone: profile?.phone_number || "",
      email: user?.email || "",
    }),
    [profile, user],
  );

  const referralDiscountAmount = Math.floor(
    (subtotal * referralDiscountPercent) / 100,
  );
  
  // Apply 5% member discount
  const memberDiscountAmount = user ? Math.floor(subtotal * 0.05) : 0;
  
  const finalTotal = subtotal - promoDiscount - referralDiscountAmount - memberDiscountAmount;

  const handleSuccess = (orderId: string, paymentMethod: string) => {
    clearCart();
    const params = new URLSearchParams();
    if (orderId) params.set("orderId", orderId);
    if (paymentMethod) params.set("method", paymentMethod);
    router.push(`/checkout/success?${params.toString()}`);
  };

  if (loading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Захиалга баталгаажуулах
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Төлбөр тооцоо аюулгүй, нууцлалтай хамгаалагдсан
                </p>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
              <span className="text-4xl mb-4 block">🛒</span>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Таны сагс хоосон байна</h2>
              <p className="text-gray-500 text-sm mb-6">{t("cart.emptyCart")}</p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                Дэлгүүр хэсэх
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
                <CheckoutForm
                  items={items}
                  defaultValues={defaultValues}
                  onSuccess={handleSuccess}
                />
              </div>

              {/* Sidebar Section */}
              <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
                {/* Discount and loyalty selectors */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 space-y-5 shadow-sm">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h4z" />
                    </svg>
                    Хөнгөлөлт & Урамшуулал
                  </h2>
                  <PromoCodeInput
                    orderAmount={subtotal}
                    onApply={(discountAmt, id) => {
                      setPromoDiscount(discountAmt);
                      setPromoCodeId(id);
                    }}
                  />
                  <DiscountSelector
                    subtotal={subtotal}
                    onDiscountChange={(percent) =>
                      setReferralDiscountPercent(percent)
                    }
                  />
                </section>

                <CheckoutSummary
                  items={items}
                  subtotal={subtotal}
                  discount={promoDiscount + referralDiscountAmount + memberDiscountAmount}
                  total={finalTotal}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
