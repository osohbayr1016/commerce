"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductDetail } from "@/data/mockProductDetail";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import CartAnimation from "./CartAnimation";
import FireworkAnimation from "./FireworkAnimation";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const [animateCart, setAnimateCart] = useState(false);
  const [showFirework, setShowFirework] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const shortDescription =
    product.description ||
    "Манай дэлгүүр АНУ-аас бараагаа илгээдэг тул захиалга баталгаажсаны дараа 10–14 хоногийн дотор Монголд очих бөгөөд каргоны төлбөрийг тусад нь төлөхийг анхаарна уу.";

  const handleCartAction = (goToCheckout: boolean) => {
    // Removed auth check
    // if (!user) {
    //   router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    //   return;
    // }
    addItem({
      id: String(product.id),
      name: product.nameEn,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      slug: product.slug,
      brand: product.brand,
      imageColor: product.imageColor,
      brandColor: product.brandColor,
      images: product.images || [],
    });
    
    if (!goToCheckout) {
      setShowFirework(true);
      setAnimateCart(true);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowFirework(false);
      }, 1000);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    
    if (goToCheckout) {
      router.push("/checkout");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {product.brand && (
          <p className="text-sm text-gray-500">brand {product.brand}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          {product.nameEn}
        </h1>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl md:text-4xl font-semibold text-gray-900">
            {formatPrice(product.price)} ₮
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)} ₮
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {product.discount > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
              -{product.discount}%
            </span>
          )}
          {product.savings > 0 && (
            <span className="text-gray-500">
              Хэмнэлт: {formatPrice(product.savings)} ₮
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Богино тайлбар
        </h2>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          {shortDescription}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <FireworkAnimation trigger={showFirework} buttonRef={addToCartButtonRef} />
        <CartAnimation
          trigger={animateCart}
          productImage={product.images?.[0]}
          buttonRef={addToCartButtonRef}
          onComplete={() => setAnimateCart(false)}
        />
        <button
          ref={addToCartButtonRef}
          onClick={() => handleCartAction(false)}
          className={`flex-1 rounded-lg px-6 py-3 text-white text-base font-medium transition-all duration-500 ${
            showSuccess
              ? "bg-green-600 hover:bg-green-700 scale-105"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {showSuccess ? (t("toast.success") || "Ажилттай") : "Сагслах"}
        </button>
        <button
          onClick={() => handleCartAction(true)}
          className="flex-1 rounded-lg border border-gray-900 px-6 py-3 text-gray-900 text-base font-medium hover:bg-gray-50"
        >
          Захиалах
        </button>
      </div>
    </div>
  );
}
