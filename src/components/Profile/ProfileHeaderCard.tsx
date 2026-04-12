"use client";

import Image from "next/image";
import { Profile } from "@/types";

interface ProfileHeaderCardProps {
  profile: Profile;
  email: string;
  discountPercent: number;
}

export default function ProfileHeaderCard({
  profile,
  email,
  discountPercent,
}: ProfileHeaderCardProps) {
  const tierLevel = profile.tier_level || 1;
  const xp = profile.xp || 0;
  const xpPerLevel = 1000;
  const currentLevelXp = (tierLevel - 1) * xpPerLevel;
  const nextLevelXp = tierLevel * xpPerLevel;
  const progress = Math.min(
    100,
    Math.max(0, ((xp - currentLevelXp) / xpPerLevel) * 100),
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)]">
      <div className="bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-5 pb-8 pt-6 text-white md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]">
            Maayaa Club
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-300">Member Level</p>
            <p className="text-2xl font-semibold">{tierLevel}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/10">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                {profile.full_name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold">{profile.full_name || "User"}</p>
            <p className="truncate text-sm text-zinc-300">{email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <p className="font-medium text-zinc-700">Level progress</p>
            <p className="font-semibold text-zinc-900">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-zinc-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Reach {nextLevelXp} XP for Level {tierLevel + 1}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-zinc-200 p-3 text-center">
            <p className="text-[11px] text-zinc-500">XP</p>
            <p className="text-base font-semibold text-zinc-900">{xp}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
            <p className="text-[11px] text-zinc-500">Coins</p>
            <p className="text-base font-semibold text-amber-700">{profile.coin_balance || 0}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
            <p className="text-[11px] text-zinc-500">Discount</p>
            <p className="text-base font-semibold text-emerald-700">{discountPercent}%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
