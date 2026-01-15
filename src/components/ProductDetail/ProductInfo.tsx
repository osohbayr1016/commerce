"use client";

import { usePathname, useRouter } from "next/navigation";
import { ProductDetail } from "@/data/mockProductDetail";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const shortDescription =
    product.description ||
    "Манай дэлгүүр АНУ-аас бараагаа илгээдэг тул захиалга баталгаажсаны дараа 10–14 хоногийн дотор Монголд очих бөгөөд каргоны төлбөрийг тусад нь төлөхийг анхаарна уу.";

  const handleCartAction = (goToCheckout: boolean) => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
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
    });
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
        <button
          onClick={() => handleCartAction(false)}
          className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-white text-base font-medium hover:bg-gray-800"
        >
          Сагслах
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
