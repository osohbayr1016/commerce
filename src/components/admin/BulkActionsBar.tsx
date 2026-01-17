'use client';

import { useModal } from '@/hooks/useModal';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkPriceUpdate: () => void;
  onBulkStockUpdate: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkPriceUpdate,
  onBulkStockUpdate,
}: BulkActionsBarProps) {
  const modal = useModal();

  if (selectedCount === 0) return null;

  const handleBulkDelete = () => {
    modal.showConfirm(
      'Олноор устгах',
      `Та ${selectedCount} бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`,
      onBulkDelete,
      'Устгах',
      'Цуцлах'
    );
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{selectedCount} сонгогдсон</span>
        </div>

        <div className="h-6 w-px bg-gray-700" />

        <div className="flex items-center gap-2">
          <button
            onClick={onBulkPriceUpdate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition"
          >
            Үнэ өөрчлөх
          </button>

          <button
            onClick={onBulkStockUpdate}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition"
          >
            Нөөц өөрчлөх
          </button>

          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition"
          >
            Устгах
          </button>

          <button
            onClick={onClearSelection}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition"
          >
            Цуцлах
          </button>
        </div>
      </div>
    </div>
  );
}
