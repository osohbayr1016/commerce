import Skeleton from "@/components/ui/Skeleton";

export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:block w-56 border-r border-gray-200 bg-white p-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </aside>
      <main className="flex-1 p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </main>
    </div>
  );
}
