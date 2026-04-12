import AdminOrdersManager from "@/components/admin/AdminOrdersManager";

export default async function OrdersPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Захиалга
        </h1>
        <p className="text-base text-gray-600">
          Захиалгуудыг харах ба удирдах
        </p>
      </div>
      <AdminOrdersManager />
    </div>
  );
}
