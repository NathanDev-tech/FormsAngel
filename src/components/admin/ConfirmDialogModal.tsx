import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  isDeleting?: boolean;
}

export const ConfirmDialogModal: React.FC<ConfirmDialogModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Đồng Ý Xóa',
  cancelLabel = 'Hủy Bỏ',
  onConfirm,
  onClose,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[40px]"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 min-h-[40px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Đang Xóa...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
