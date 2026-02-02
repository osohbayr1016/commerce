interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export default function Skeleton({
  className = "",
  shimmer = true,
}: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={`rounded bg-gray-200 ${
        shimmer ? "skeleton-shimmer" : "animate-pulse"
      } ${className}`}
    />
  );
}
