import Link from "next/link";
import { getSizesForType } from "@/lib/product-types";
import type { ProductType } from "@/types";

const TYPE_CONFIG: Array<{
  type: ProductType;
  title: string;
  description: string;
}> = [
  {
    type: "shoes",
    title: "Гутал",
    description: "EU размер ашигладаг бараанууд.",
  },
  {
    type: "clothes",
    title: "Хувцас",
    description: "S / M / L / XL хэмжээтэй бараанууд.",
  },
  {
    type: "beauty",
    title: "Гоо сайхан",
    description: "Хэмжээ сонголтгүй гоо сайхны бараанууд.",
  },
  {
    type: "other",
    title: "Бусад",
    description: "Өнгө болон энгийн сонголттой бараанууд.",
  },
];

export default function AdminTypesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Бүтээгдэхүүний төрөл
        </h1>
        <p className="text-gray-600">
          Төрөл бүр дээр ашиглагдах хэмжээний дүрмийг эндээс харна.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TYPE_CONFIG.map((item) => {
          const sizes = getSizesForType(item.type);
          return (
            <div
              key={item.type}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h2>
                <span className="text-xs uppercase bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {item.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>

              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">Хэмжээний сонголт:</p>
                {sizes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <span
                        key={`${item.type}-${size}`}
                        className="px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Энэ төрөлд хэмжээ сонголт байхгүй.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Бүтээгдэхүүн рүү буцах
        </Link>
      </div>
    </div>
  );
}
