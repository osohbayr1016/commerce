'use client';

import { create } from 'zustand';
import Modal, { ModalType } from '@/components/ui/Modal';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalStore extends ModalState {
  showModal: (config: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  showModal: (config) => set({ ...config, isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export function useModal() {
  const store = useModalStore();

  return {
    showSuccess: (title: string, message: string, confirmText = 'OK') => {
      store.showModal({ type: 'success', title, message, confirmText });
    },
    showError: (title: string, message: string, confirmText = 'OK') => {
      store.showModal({ type: 'error', title, message, confirmText });
    },
    showWarning: (title: string, message: string, confirmText = 'OK') => {
      store.showModal({ type: 'warning', title, message, confirmText });
    },
    showConfirm: (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText = 'Confirm',
      cancelText = 'Cancel'
    ) => {
      store.showModal({
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
      });
    },
    close: store.closeModal,
  };
}

export function ModalProvider() {
  const state = useModalStore();

  return (
    <Modal
      isOpen={state.isOpen}
      type={state.type}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      onConfirm={state.onConfirm}
      onCancel={state.onCancel}
      onClose={state.closeModal}
    />
  );
}
