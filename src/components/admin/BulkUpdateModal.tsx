'use client';

import { useState } from 'react';
import { useModal } from '@/hooks/useModal';

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'price' | 'stock';
  selectedCount: number;
  onSubmit: (value: number, action: string) => Promise<void>;
}

export default function BulkUpdateModal({
  isOpen,
  onClose,
  type,
  selectedCount,
  onSubmit,
}: BulkUpdateModalProps) {
  const [value, setValue] = useState<string>('');
  const [action, setAction] = useState<string>('set');
  const [loading, setLoading] = useState(false);
  const modal = useModal();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      modal.showError('Алдаа', 'Зөв утга оруулна уу');
      return;
    }

    if (type === 'price' && numValue < 0) {
      modal.showError('Алдаа', 'Үнэ 0-с бага байж болохгүй');
      return;
    }

    if (type === 'stock' && numValue < 0) {
      modal.showError('Алдаа', 'Нөөц 0-с бага байж болохгүй');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(numValue, action);
      setValue('');
      setAction('set');
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const title = type === 'price' ? 'Үнэ өөрчлөх' : 'Нөөц өөрчлөх';
  const placeholder = type === 'price' ? '89000' : '100';
  const unit = type === 'price' ? '₮' : 'ширхэг';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {selectedCount} бүтээгдэхүүнд хамаарна
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Үйлдэл
                  </label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="set">Тогтоох</option>
                    {type === 'price' && (
                      <>
                        <option value="increase">Нэмэгдүүлэх</option>
                        <option value="decrease">Бууруулах</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {action === 'set' ? 'Шинэ утга' : 'Өөрчлөлт'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={placeholder}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-2.5 text-gray-500">
                      {unit}
                    </span>
                  </div>
                  {action !== 'set' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Жишээ: +10000 эсвэл -5000
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                Цуцлах
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Боловсруулж байна...' : 'Хадгалах'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
