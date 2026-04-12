"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedNameFromProduct } from "@/lib/localize";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    } else {
      document.body.style.overflow = "unset";
      setSelectedSize(undefined);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product]);

  if (!product) return null;

  const displayName = getLocalizedNameFromProduct(product, language, "Product");
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("mn-MN").format(price);

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden pointer-events-auto"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-100">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex w-full h-full items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-6 flex flex-col">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  {product.brand}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {displayName}
                </h2>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)} ₮
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)} ₮
                    </span>
                  )}
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Size</span>
                      <a href="#" className="text-sm text-gray-500 underline">Size Guide</a>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size: number) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 border rounded-xl text-sm font-medium transition-all ${
                            selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-900 hover:border-gray-900"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                  >
                    {t("products.addToCart")}
                  </button>
                  <a
                    href={`/products/${product.slug || product.id}`}
                    className="block text-center mt-4 text-sm font-medium text-gray-600 hover:text-black underline"
                  >
                    View full details
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
