import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1">
        <div className="h-48 sm:h-64 md:h-80 bg-gray-100 skeleton-shimmer rounded-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
