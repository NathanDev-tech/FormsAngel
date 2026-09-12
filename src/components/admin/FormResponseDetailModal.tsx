import React from 'react';
import { X, Calendar, UserCheck, FileText } from 'lucide-react';
import { FormField, FormResponseWithAnswers } from '../../types/forms.ts';
import { formatDateVi } from '../../utils/csvExport.ts';

interface FormResponseDetailModalProps {
  response: FormResponseWithAnswers | null;
  fields: FormField[];
  isOpen: boolean;
  onClose: () => void;
}

export const FormResponseDetailModal: React.FC<FormResponseDetailModalProps> = ({
  response,
  fields,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !response) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Chi Tiết Phản Hồi
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Gửi lúc: {formatDateVi(response.created_at)}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Answers Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {fields.map(field => {
            const answerValue = response.answersMap[field.id] || '(Không điền)';
            return (
              <div key={field.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{field.label}</span>
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-pre-line pl-5">
                  {answerValue}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
