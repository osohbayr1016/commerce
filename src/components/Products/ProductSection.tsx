import { Product } from '@/data/mockProducts';
import ProductGrid from './ProductGrid';

interface ProductSectionProps {
  products: Product[];
  title?: string;
  loading?: boolean;
}

export default function ProductSection({ products, title, loading = false }: ProductSectionProps) {
  return (
    <section className="py-8 md:py-10 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 md:mb-8">{title}</h2>
        )}
        <ProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
}
