"use client";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={`rounded bg-gray-200 animate-pulse ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[4/5] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-1/3 rounded" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
