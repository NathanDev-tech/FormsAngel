import React from 'react';
import { COMMUNITY_CATEGORIES, CommunityCategory } from '../../types/community.ts';
import { LayoutGrid } from 'lucide-react';

interface CommunityFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const options = ['Tất cả', ...COMMUNITY_CATEGORIES];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar scroll-smooth">
      {options.map(cat => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 border ${
              isSelected
                ? 'bg-sky-600 dark:bg-sky-500 text-white border-sky-600 dark:border-sky-500 shadow-sm shadow-sky-600/20 scale-102'
                : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            {cat === 'Tất cả' ? (
              <span className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tất cả</span>
              </span>
            ) : (
              cat
            )}
          </button>
        );
      })}
    </div>
  );
};
