"use client";

import { Modal } from "./Modal";
import { Spinner } from "./Spinner";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({ open, title, message, confirmLabel, danger, isLoading, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-800 hover:bg-blue-900"
            }`}
          >
            {isLoading && <Spinner className="h-4 w-4 text-white" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  );
}
