import Top6Manager from '@/components/admin/Top6Manager';

export default function AdminTop6Page() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Top 6 Management</h1>
          <p className="text-gray-600 mt-2">
            Referral системийн Top 6 гишүүдийг удирдах
          </p>
        </div>

        <Top6Manager />
      </div>
    </div>
  );
}
