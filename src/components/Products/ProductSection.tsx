import Link from "next/link";
import { Product } from "@/data/mockProducts";
import ProductGrid from "./ProductGrid";

interface ProductSectionProps {
  products: Product[];
  title?: string;
  loading?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function ProductSection({
  products,
  title,
  loading = false,
  viewAllHref,
  viewAllLabel = "View all",
}: ProductSectionProps) {
  return (
    <section className="py-8 md:py-10 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || viewAllHref) && (
          <div className="flex items-center justify-between mb-6 md:mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {viewAllLabel}
              </Link>
            )}
          </div>
        )}
        <ProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
}
