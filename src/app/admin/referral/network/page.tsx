import ReferralNetworkViewer from '@/components/admin/ReferralNetworkViewer';

export default function AdminReferralNetworkPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Referral Network</h1>
          <p className="text-gray-600 mt-2">
            Referral сүлжээний бүтэц болон холбоосуудыг харах
          </p>
        </div>

        <ReferralNetworkViewer />
      </div>
    </div>
  );
}
