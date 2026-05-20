import AdminOrdersManager from "@/components/admin/AdminOrdersManager";

export default async function OrdersPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 print:hidden">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          Захиалга удирдах
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Захиалгуудыг хянах, төлөв шинэчлэх, баримт хэвлэх болон нэгдсэн систем
        </p>
      </div>
      <AdminOrdersManager />
    </div>
  );
}
