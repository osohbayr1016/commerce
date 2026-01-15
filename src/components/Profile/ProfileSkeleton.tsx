"use client";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-56 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
