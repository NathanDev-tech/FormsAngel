import React from 'react';
import { FileQuestion } from 'lucide-react';

export const FormNotFound: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center mx-auto">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Không tìm thấy biểu mẫu
      </h2>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị gỡ bỏ. Vui lòng kiểm tra lại liên kết được chia sẻ.
      </p>
    </div>
  );
};
