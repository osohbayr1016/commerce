import Skeleton from "@/components/ui/Skeleton";

export default function CheckoutSuccessLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <Skeleton className="h-16 w-16 rounded-full mb-4" />
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-80" />
    </div>
  );
}
