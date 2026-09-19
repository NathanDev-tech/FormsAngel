import React from 'react';
import { Lock } from 'lucide-react';

interface FormClosedProps {
  title?: string;
}

export const FormClosed: React.FC<FormClosedProps> = ({ title }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Biểu mẫu này hiện không nhận phản hồi.
      </h2>

      {title && (
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Biểu mẫu: <span className="font-semibold text-slate-700 dark:text-slate-300">{title}</span>
        </p>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
        Ban Điều Hành Ca Đoàn đã tạm ngừng nhận thông tin cho biểu mẫu này. Vui lòng liên hệ ban điều hành nếu bạn cần sự hỗ trợ.
      </p>
    </div>
  );
};
