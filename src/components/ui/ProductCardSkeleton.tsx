import Skeleton from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white overflow-hidden">
      <div className="mb-3">
        <Skeleton className="w-16 h-8" />
      </div>
      <div className="mb-4">
        <Skeleton className="w-full aspect-square rounded border border-gray-200" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="pt-3 mt-auto">
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}
