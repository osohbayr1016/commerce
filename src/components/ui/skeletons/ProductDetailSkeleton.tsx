import Skeleton from "@/components/ui/Skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 text-sm mb-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-24 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-20" />
              <div className="flex gap-2 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-14 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-lg mt-4" />
            </div>
          </div>
          <div className="max-w-4xl space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="max-w-4xl mt-12 pt-8 border-t border-gray-200">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 w-5 rounded" />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
