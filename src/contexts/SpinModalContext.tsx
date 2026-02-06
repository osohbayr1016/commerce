'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import SpinWheel from '@/components/Spin/SpinWheel';

type SpinModalContextType = {
  openSpinModal: () => void;
  closeSpinModal: () => void;
};

const SpinModalContext = createContext<SpinModalContextType | null>(null);

export function useSpinModal() {
  const ctx = useContext(SpinModalContext);
  return ctx;
}

export function SpinModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSpinModal = useCallback(() => setIsOpen(true), []);
  const closeSpinModal = useCallback(() => setIsOpen(false), []);

  return (
    <SpinModalContext.Provider value={{ openSpinModal, closeSpinModal }}>
      {children}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 right-0 flex justify-end p-2 bg-white border-b border-gray-100 z-10">
                <button
                  type="button"
                  onClick={closeSpinModal}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  aria-label="Хаах"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <SpinWheel />
              </div>
            </div>
          </div>,
          document.body
        )}
    </SpinModalContext.Provider>
  );
}
