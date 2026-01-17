"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/data/mockProducts';
import { generateSlug } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import ProductQuickView from './ProductQuickView';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [stock, setStock] = useState<number | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  const slug = product.id ? generateSlug(`${product.brand} ${product.nameEn}`, product.id) : "";

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  useEffect(() => {
    if (product.id) {
      fetch(`/api/products/${product.id}/stock`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return { stock: null };
        })
        .then((data) => {
          if (data && typeof data.stock === 'number') {
            setStock(data.stock);
          }
        })
        .catch(() => {
          
        });
    }
  }, [product.id]);

  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock < 5;

  return (
    <div className={`group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col h-full relative ${isOutOfStock ? 'opacity-75' : ''}`}>
      {product.id && (
        <div className="absolute top-4 right-4 z-10">
          <WishlistButton productId={String(product.id)} />
        </div>
      )}
      <a href={`/products/${slug}`} className="flex flex-col flex-1">
        <div className="mb-3 relative">
          <div
            className="w-16 h-8 rounded border border-gray-200 bg-gray-50"
            style={{ backgroundColor: product.brandColor }}
          />
          {isOutOfStock && (
            <span className="absolute top-0 right-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
              Бэлэн бараа байхгүй
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="absolute top-0 right-0 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
              {stock} ширхэг үлдсэн
            </span>
          )}
        </div>
        <div className="mb-4 relative group/image">
          {product.images && product.images.length > 0 && product.images[0] ? (
            <>
              <div className="w-full aspect-square rounded border border-gray-200 overflow-hidden relative cursor-pointer" onClick={handleImageClick}>
                <Image
                  src={product.images[0]}
                  alt={product.nameEn || product.nameMn || 'Product'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <button
                onClick={handleImageClick}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover/image:opacity-100"
              >
                <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-900 shadow-lg">
                  Хурдан үзэх
                </span>
              </button>
            </>
          ) : (
            <div
              className="w-full aspect-square rounded border border-gray-200 bg-gray-50 cursor-pointer"
              style={{ backgroundColor: product.imageColor }}
              onClick={handleImageClick}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.nameEn}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1 min-h-[1.25rem]">{product.nameMn}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base md:text-lg font-semibold text-gray-900">
              {formatPrice(product.price)} ₮
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)} ₮
            </span>
            {product.discount && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </a>
      <div className="pt-3 mt-auto">
        <AddToCartButton product={product} slug={slug} />
      </div>
      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
}
