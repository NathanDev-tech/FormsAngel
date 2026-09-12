import React from 'react';
import { CheckCircle2, HeartHandshake } from 'lucide-react';

interface FormSuccessProps {
  formTitle: string;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ formTitle }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-5">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          ✅ GỬI THÔNG TIN THÀNH CÔNG
        </h2>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {formTitle}
        </p>
      </div>

      <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-2">
        <p>Cảm ơn bạn đã gửi thông tin. Thông tin của bạn đã được hệ thống ghi nhận.</p>
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          Bạn có thể an tâm đóng trang này.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <HeartHandshake className="w-4 h-4 text-amber-500" />
        <span>Ca Đoàn Thiên Thần xin trân trọng cảm ơn!</span>
      </div>
    </div>
  );
};
