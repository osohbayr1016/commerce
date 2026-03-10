"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductDetail } from "@/data/mockProductDetail";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedNameFromProduct, getLocalizedDescription } from "@/lib/localize";
import { getAvailabilityStatusLabel } from "@/lib/availability-status";
import CartAnimation from "./CartAnimation";
import FireworkAnimation from "./FireworkAnimation";
import VariantSelector from "@/components/Products/VariantSelector";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const displayName = getLocalizedNameFromProduct(product, language, "Product");
  const router = useRouter();
  const pathname = usePathname();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const [animateCart, setAnimateCart] = useState(false);
  const [showFirework, setShowFirework] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const hasColors = (product.colors?.length ?? 0) > 0;
  const needsSize =
    product.productType !== "beauty" &&
    product.productType !== "other" &&
    (product.sizes?.length ?? 0) > 0;
  const canAddToCart =
    (!needsSize || selectedSize != null) &&
    (!hasColors || selectedColor != null);
  const descObj = {
    description_en: product.descriptionEn,
    description_mn: product.descriptionMn,
    description_ru: product.descriptionRu,
    description_zh: product.descriptionZh,
    description_it: product.descriptionIt,
  };
  const shortDescription =
    getLocalizedDescription(descObj, language) ||
    product.description ||
    "Манай дэлгүүр АНУ-аас бараагаа илгээдэг тул захиалга баталгаажсаны дараа 10–14 хоногийн дотор Монголд очих бөгөөд каргоны төлбөрийг тусад нь төлөхийг анхаарна уу.";

  const handleCartAction = (goToCheckout: boolean) => {
    if (!canAddToCart) return;
    addItem({
      id: String(product.id),
      name: displayName,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      slug: product.slug,
      brand: product.brand,
      imageColor: product.imageColor,
      brandColor: product.brandColor,
      images: product.images || [],
      ...(selectedSize != null && { size: selectedSize }),
      ...(selectedColor != null && { color: selectedColor }),
      ...(product.productType && { productType: product.productType }),
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
          {displayName}
        </h1>
        {product.availabilityStatus && (
          <span
            className={`inline-block mt-2 rounded-full px-2.5 py-1 text-sm font-medium ${
              product.availabilityStatus === "in_stock"
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {getAvailabilityStatusLabel(product.availabilityStatus, language)}
          </span>
        )}
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

      <VariantSelector
        productType={product.productType}
        colors={product.colors}
        sizes={product.sizes}
        defaultColor={selectedColor}
        defaultSize={selectedSize}
        onVariantChange={(v) => {
          if (v.size !== undefined) setSelectedSize(v.size);
          if (v.color !== undefined) setSelectedColor(v.color);
        }}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <FireworkAnimation
          trigger={showFirework}
          buttonRef={addToCartButtonRef}
        />
        <CartAnimation
          trigger={animateCart}
          productImage={product.images?.[0]}
          buttonRef={addToCartButtonRef}
          onComplete={() => setAnimateCart(false)}
        />
        <button
          ref={addToCartButtonRef}
          onClick={() => handleCartAction(false)}
          disabled={!canAddToCart}
          className={`flex-1 rounded-lg px-6 py-3 text-white text-base font-medium transition-all duration-500 ${
            !canAddToCart
              ? "bg-gray-400 cursor-not-allowed"
              : showSuccess
                ? "bg-green-600 hover:bg-green-700 scale-105"
                : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {showSuccess ? t("toast.success") || "Ажилттай" : "Сагслах"}
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
