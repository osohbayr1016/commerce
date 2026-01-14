import Link from "next/link";

export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-6xl font-bold text-gray-900 mb-4">404</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Хуудас олдсонгүй
          </h1>
          <p className="text-gray-600 mb-6">
            Уучлаарай, таны хайж буй хуудас олдсонгүй.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Нүүр хуудас руу буцах
            </Link>
            <Link
              href="/products"
              className="block w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Бүтээгдэхүүн үзэх
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
