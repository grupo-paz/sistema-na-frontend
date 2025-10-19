import { useState, ComponentType } from "react";
import { ConfirmModal } from "./confirm-modal";

export interface ConfirmModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  oneButton?: boolean;
}

export function withConfirmModal<P>(Component: ComponentType<P & { showConfirm: (options: ConfirmModalOptions) => void }>) {
  const WithConfirmModal = (props: P) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState<ConfirmModalOptions | null>(null);
    const [pendingConfirm, setPendingConfirm] = useState<(() => void) | null>(null);

    function showConfirm(options: ConfirmModalOptions) {
      setModalOptions(options);
      setModalOpen(true);
      setPendingConfirm(() => options.onConfirm || null);
    }

    function handleConfirm() {
      setModalOpen(false);
      if (pendingConfirm) pendingConfirm();
    }

    function handleCancel() {
      setModalOpen(false);
    }

    return (
      <>
        <Component {...props} showConfirm={showConfirm} />
        <ConfirmModal
          open={modalOpen}
          title={modalOptions?.title}
          message={modalOptions?.message || ''}
          confirmText={modalOptions?.confirmText}
          cancelText={modalOptions?.cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          oneButton={modalOptions?.oneButton}
        />
      </>
    );
  };
  
  return WithConfirmModal;
}
