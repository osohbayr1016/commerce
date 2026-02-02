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
    [profile, user]
  );

  const referralDiscountAmount = Math.floor(
    (subtotal * referralDiscountPercent) / 100
  );
  const finalTotal = subtotal - promoDiscount - referralDiscountAmount;

  const handleSuccess = () => {
    clearCart();
    router.push("/profile?tab=orders");
  };

  if (loading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
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
                <DiscountSelector
                  subtotal={subtotal}
                  onDiscountChange={(percent) =>
                    setReferralDiscountPercent(percent)
                  }
                />
                <CheckoutSummary
                  items={items}
                  subtotal={subtotal}
                  discount={promoDiscount + referralDiscountAmount}
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
