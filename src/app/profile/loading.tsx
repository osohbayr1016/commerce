import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <ProfileSkeleton />
      </main>
    </div>
  );
}
