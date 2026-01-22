import ReferralAnalytics from '@/components/admin/ReferralAnalytics';

export default function AdminReferralAnalyticsPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Referral Analytics</h1>
          <p className="text-gray-600 mt-2">
            Referral системийн нарийвчилсан мэдээлэл
          </p>
        </div>

        <ReferralAnalytics />
      </div>
    </div>
  );
}
