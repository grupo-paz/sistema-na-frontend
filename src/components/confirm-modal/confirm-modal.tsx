
import React from "react";

import "./stylesheets/confirm-modal.css";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  oneButton?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Confirmação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  oneButton = false,
}) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2>{title}</h2>}
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm" onClick={onConfirm}>{confirmText}</button>
          {!oneButton && <button className="cancel" onClick={onCancel}>{cancelText}</button>}
        </div>
      </div>
    </div>
  );
};
