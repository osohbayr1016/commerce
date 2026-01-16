export default function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
      <div className="mb-3">
        <div className="w-16 h-8 bg-gray-200 rounded"></div>
      </div>
      <div className="mb-4">
        <div className="w-full aspect-square bg-gray-200 rounded border border-gray-200"></div>
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      <div className="pt-3 mt-auto">
        <div className="h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}
