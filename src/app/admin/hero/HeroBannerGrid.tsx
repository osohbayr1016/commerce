"use client";

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  link: string | null;
}

export default function HeroBannerGrid({
  banners,
  onDelete,
}: {
  banners: Banner[];
  onDelete: (id: string) => void;
}) {
  if (banners.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Current carousel slides
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
          >
            <img
              src={banner.image_url || ""}
              alt="Slide"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onDelete(banner.id)}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label="Remove from carousel"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
