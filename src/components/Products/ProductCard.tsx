import { Product } from '@/data/mockProducts';
import { generateSlug } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  const slug = generateSlug(`${product.brand} ${product.nameEn}`, product.id);

  return (
    <div className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <a href={`/products/${slug}`} className="block">
        <div className="mb-3">
          <div
            className="w-16 h-8 rounded border border-gray-200 bg-gray-50"
            style={{ backgroundColor: product.brandColor }}
          />
        </div>
        <div className="mb-4">
          <div
            className="w-full aspect-square rounded border border-gray-200 bg-gray-50"
            style={{ backgroundColor: product.imageColor }}
          />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 leading-snug">
            {product.nameEn}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{product.nameMn}</p>
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
    </div>
  );
}
