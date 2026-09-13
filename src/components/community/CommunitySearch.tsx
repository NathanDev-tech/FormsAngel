import React from 'react';
import { Search, X } from 'lucide-react';

interface CommunitySearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const CommunitySearch: React.FC<CommunitySearchProps> = ({
  value,
  onChange,
  placeholder = '🔎 Tìm kiếm bài viết...',
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-2xs"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Xóa từ khóa tìm kiếm"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
