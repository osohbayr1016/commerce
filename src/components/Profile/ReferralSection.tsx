"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/ToastContainer";
import { createClient } from "@/lib/supabase/client";

interface Referral {
  id: string;
  referred_id: string;
  status: string;
  referrer_reward_xp: number;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export default function ReferralSection() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const supabase = createClient();

  const referralUrl = profile?.referral_code 
    ? `${window.location.origin}/auth/signup?ref=${profile.referral_code}`
    : "";

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [user]);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          profiles!referrals_referred_id_fkey(full_name, email)
        `)
        .eq("referrer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      showToast("Referral link copied!", "success");
    } catch (err) {
      showToast("Failed to copy", "error");
    } finally {
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const totalRewards = referrals
    .filter(r => r.status === "completed")
    .reduce((sum, r) => sum + r.referrer_reward_xp, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Referral Program
      </h3>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600">Your Referral Code</h4>
            <p className="text-2xl font-bold text-gray-900">{profile?.referral_code || "Loading..."}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Total Referrals</p>
            <p className="text-xl font-bold text-gray-900">{referrals.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">XP Earned</p>
            <p className="text-xl font-bold text-gray-900">{totalRewards} XP</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="bg-transparent flex-1 text-sm text-gray-900 outline-none"
            />
            <button
              onClick={() => copyToClipboard(referralUrl)}
              disabled={copying}
              className="ml-2 px-3 py-1 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition"
            >
              {copying ? "Copied!" : "Copy"}
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(profile?.referral_code || "")}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-900 transition"
          >
            Copy Code Only
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Share your referral link with friends</li>
              <li>• They sign up and make their first purchase</li>
              <li>• You both earn 500 XP bonus!</li>
              <li>• Level up faster and get better discounts</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Your Referrals</h4>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No referrals yet</p>
            <p className="text-sm">Start sharing your code to earn rewards!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {referral.profiles?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {referral.status === "completed" && (
                    <span className="text-sm font-medium text-green-600">
                      +{referral.referrer_reward_xp} XP
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(
                      referral.status
                    )}`}
                  >
                    {referral.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
