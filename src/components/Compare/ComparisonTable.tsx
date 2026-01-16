"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";

interface ComparisonTableProps {
  products: Product[];
  reviews: Record<string, { average: number; count: number }>;
  onRemove: (productId: string) => void;
}

export default function ComparisonTable({ products, reviews, onRemove }: ComparisonTableProps) {
  const router = useRouter();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({reviews[products[0]?.id || ""]?.count || 0})
        </span>
      </div>
    );
  };

  const comparisonRows = [
    {
      label: "Image",
      render: (product: Product) => (
        <div className="flex justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name_en || product.name_mn || ""}
              className="w-full max-w-[200px] aspect-square object-cover rounded-lg"
            />
          ) : (
            <div
              className="w-full max-w-[200px] aspect-square rounded-lg"
              style={{ backgroundColor: product.image_color || "#f5f5f5" }}
            />
          )}
        </div>
      ),
    },
    {
      label: "Product Name",
      render: (product: Product) => (
        <div className="text-center">
          <p className="font-semibold text-gray-900">{product.name_en}</p>
          <p className="text-sm text-gray-600">{product.name_mn}</p>
        </div>
      ),
    },
    {
      label: "Brand",
      render: (product: Product) => (
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded border" style={{ backgroundColor: product.brand_color || "#f5f5f5" }}>
            {product.brand || "N/A"}
          </span>
        </div>
      ),
    },
    {
      label: "Price",
      render: (product: Product) => (
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(product.price || 0)} ₮
          </p>
          {product.original_price && product.original_price > (product.price || 0) && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(product.original_price)} ₮
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Discount",
      render: (product: Product) => (
        <div className="text-center">
          {product.discount ? (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded font-medium">
              -{product.discount}%
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      label: "Rating",
      render: (product: Product) => (
        <div className="flex justify-center">
          {reviews[product.id || ""] ? (
            renderStars(Math.round(reviews[product.id || ""]?.average || 0))
          ) : (
            <span className="text-sm text-gray-400">No reviews</span>
          )}
        </div>
      ),
    },
    {
      label: "Stock",
      render: (product: Product) => (
        <div className="text-center">
          {product.stock !== undefined ? (
            product.stock > 0 ? (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                Out of Stock
              </span>
            )
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      label: "Sizes",
      render: (product: Product) => (
        <div className="flex justify-center gap-1 flex-wrap">
          {product.sizes && product.sizes.length > 0 ? (
            product.sizes.map((size) => (
              <span
                key={size}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {size}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </div>
      ),
    },
    {
      label: "Description",
      render: (product: Product) => (
        <div className="text-center text-sm text-gray-600 max-h-20 overflow-y-auto px-2">
          {product.description || "No description available"}
        </div>
      ),
    },
    {
      label: "Actions",
      render: (product: Product) => (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              const slug = generateSlug(
                `${product.brand} ${product.name_en}`,
                product.id || ""
              );
              router.push(`/products/${slug}`);
            }}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            View Details
          </button>
          <button
            onClick={() => onRemove(product.id || "")}
            className="w-full px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
              Feature
            </th>
            {products.map((product, index) => (
              <th
                key={product.id || index}
                className="px-4 py-3 text-center text-sm font-semibold text-gray-900 bg-gray-50 min-w-[250px]"
              >
                Product {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
                {row.label}
              </td>
              {products.map((product, index) => (
                <td key={product.id || index} className="px-4 py-4">
                  {row.render(product)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
