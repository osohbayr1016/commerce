import Skeleton from "@/components/ui/Skeleton";

function CartRowSkeleton() {
  return (
    <div className="flex gap-4 border border-gray-200 rounded-lg p-4">
      <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 shrink-0" />
    </div>
  );
}

export default function CartSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-24 mb-6" />
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-14 w-full rounded-lg mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CartRowSkeleton key={i} />
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
            <div className="flex justify-end gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-12 w-full sm:w-48 rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
