import React from 'react';
import { FormField } from '../../types/forms.ts';

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

  // Render các loại input phù hợp
  const renderInput = () => {
    switch (field_type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Nhập câu trả lời của bạn...'}
            rows={3}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm`}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm`}
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
            {options.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <input
                  type="radio"
                  name={`radio_${field.id}`}
                  value={opt}
                  checked={value === opt}
                  onChange={e => onChange(e.target.value)}
                  className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
              </label>
            ))}
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
            {options.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt)}
                  onChange={() => toggleCheckbox(opt)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
              </label>
            ))}
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
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Nhập con số...'}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm`}
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
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm`}
          />
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
        {label}
        {required && <span className="text-red-500 font-bold ml-1">*</span>}
      </label>

      {renderInput()}

      {error && <p className="text-xs font-semibold text-red-500 pt-1 animate-pulse">{error}</p>}
    </div>
  );
};
