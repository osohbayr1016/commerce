export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Уншиж байна...</p>
      </div>
    </div>
  );
}
