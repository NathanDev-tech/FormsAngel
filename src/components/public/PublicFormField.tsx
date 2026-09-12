import React from 'react';
import { FormField } from '../../types/forms.ts';
import { Check } from 'lucide-react';

interface PublicFormFieldProps {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const PublicFormField: React.FC<PublicFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const { label, field_type, placeholder, required, options } = field;

  // Render các loại câu hỏi
  const renderInput = () => {
    switch (field_type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Nhập câu trả lời của bạn...'}
            rows={3}
            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border ${
              error 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } bg-slate-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm min-h-[100px]`}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border ${
              error 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } bg-slate-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium h-12 cursor-pointer`}
          >
            <option value="">-- {placeholder || 'Vui lòng chọn một tùy chọn'} --</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2.5 pt-1">
            {options.map((opt, idx) => {
              const isChecked = value === opt;
              return (
                <label
                  key={idx}
                  onClick={() => onChange(opt)}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border min-h-[48px] cursor-pointer transition-all select-none ${
                    isChecked
                      ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/90 dark:bg-sky-950/70 text-sky-900 dark:text-sky-100 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isChecked ? 'border-sky-500 bg-sky-500' : 'border-slate-400 dark:border-slate-600'
                    }`}>
                      {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox': {
        const selectedValues: string[] = value ? value.split(', ') : [];
        const toggleCheckbox = (opt: string) => {
          let updated: string[];
          if (selectedValues.includes(opt)) {
            updated = selectedValues.filter(v => v !== opt);
          } else {
            updated = [...selectedValues, opt];
          }
          onChange(updated.join(', '));
        };

        return (
          <div className="space-y-2.5 pt-1">
            {options.map((opt, idx) => {
              const isChecked = selectedValues.includes(opt);
              return (
                <label
                  key={idx}
                  onClick={() => toggleCheckbox(opt)}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border min-h-[48px] cursor-pointer transition-all select-none ${
                    isChecked
                      ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/90 dark:bg-sky-950/70 text-sky-900 dark:text-sky-100 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isChecked ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-400 dark:border-slate-600'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );
      }

      case 'phone':
        return (
          <input
            type="tel"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'VD: 0912345678'}
            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border ${
              error 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } bg-slate-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium h-12`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Nhập con số...'}
            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border ${
              error 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } bg-slate-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium h-12`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border ${
              error 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } bg-slate-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium h-12`}
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Nhập câu trả lời...'}
            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border ${
              error 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } bg-slate-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium h-12`}
          />
        );
    }
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs sm:shadow-md hover:shadow-lg transition-all duration-200 space-y-3 relative overflow-hidden border-l-4 ${
      error 
        ? 'border-l-red-500' 
        : required 
          ? 'border-l-amber-500' 
          : 'border-l-sky-500'
    }`}>
      
      {/* Field Label Header */}
      <div className="flex items-start justify-between gap-2">
        <label className="block text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {label}
          {required && <span className="text-red-500 font-bold ml-1">*</span>}
        </label>
        {required && (
          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 px-2 py-0.5 rounded-full shrink-0">
            Bắt buộc
          </span>
        )}
      </div>

      {/* Input Control */}
      {renderInput()}

      {/* Error Message */}
      {error && (
        <p className="text-xs font-bold text-red-500 pt-1 animate-pulse flex items-center gap-1">
          <span>⚠️ {error}</span>
        </p>
      )}
    </div>
  );
};
