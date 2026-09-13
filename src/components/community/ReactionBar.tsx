import React, { useState } from 'react';
import { ReactionType } from '../../types/community.ts';
import { toggleReaction } from '../../lib/communityApi.ts';

interface ReactionBarProps {
  postId: string;
  reactionsCount?: Record<ReactionType, number>;
  userReactions?: ReactionType[];
  onReactionChange?: () => void;
}

const REACTION_CONFIG: { type: ReactionType; icon: string; label: string }[] = [
  { type: 'heart', icon: '❤️', label: 'Yêu thích' },
  { type: 'like', icon: '👍', label: 'Thích' },
  { type: 'pray', icon: '🙏', label: 'Cầu nguyện' },
  { type: 'party', icon: '🎉', label: 'Chúc mừng' },
];

export const ReactionBar: React.FC<ReactionBarProps> = ({
  postId,
  reactionsCount = { heart: 0, like: 0, pray: 0, party: 0 },
  userReactions = [],
  onReactionChange,
}) => {
  const [counts, setCounts] = useState<Record<ReactionType, number>>(reactionsCount);
  const [activeReactions, setActiveReactions] = useState<ReactionType[]>(userReactions);
  const [loadingType, setLoadingType] = useState<ReactionType | null>(null);

  const handleToggle = async (type: ReactionType) => {
    if (loadingType) return;
    setLoadingType(type);

    try {
      const isAlreadyActive = activeReactions.includes(type);
      
      // Optimistic UI Update
      setActiveReactions(prev => 
        isAlreadyActive ? prev.filter(r => r !== type) : [...prev, type]
      );
      setCounts(prev => ({
        ...prev,
        [type]: Math.max(0, (prev[type] || 0) + (isAlreadyActive ? -1 : 1))
      }));

      const res = await toggleReaction(postId, type);
      
      setCounts(prev => ({
        ...prev,
        [type]: res.count,
      }));

      if (onReactionChange) {
        onReactionChange();
      }
    } catch (err) {
      console.error('Lỗi khi thả cảm xúc:', err);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      {REACTION_CONFIG.map(({ type, icon, label }) => {
        const count = counts[type] || 0;
        const isActive = activeReactions.includes(type);

        return (
          <button
            key={type}
            type="button"
            onClick={() => handleToggle(type)}
            disabled={loadingType === type}
            title={label}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
              isActive
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700/60 text-rose-700 dark:text-rose-300 font-bold shadow-xs scale-105'
                : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80'
            }`}
          >
            <span className="text-base leading-none transition-transform hover:scale-125">{icon}</span>
            {count > 0 && (
              <span className={`text-xs font-semibold ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
