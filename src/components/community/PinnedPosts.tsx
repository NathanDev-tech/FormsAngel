import React from 'react';
import { CommunityPost } from '../../types/community.ts';
import { Pin, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';

interface PinnedPostsProps {
  posts: CommunityPost[];
  onSelectPost: (post: CommunityPost) => void;
}

export const PinnedPosts: React.FC<PinnedPostsProps> = ({ posts, onSelectPost }) => {
  const pinnedList = posts.filter(p => p.is_pinned);

  if (pinnedList.length === 0) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-sky-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-sky-950/30 p-4 sm:p-5 border border-amber-300/50 dark:border-amber-700/40 shadow-xs space-y-3">
      
      {/* Title */}
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
        <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
          <Pin className="w-4 h-4 fill-white" />
        </div>
        <span className="tracking-wide">📌 BÀI GHIM QUAN TRỌNG</span>
        <Sparkles className="w-4 h-4 text-amber-500 ml-auto" />
      </div>

      {/* Grid or List of Pinned Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pinnedList.map(post => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group relative p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                  {post.category}
                </span>
                {post.is_important && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white uppercase tracking-wider">
                    Quan trọng
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {post.title}
              </h4>

              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold">{post.author_name}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                  <span>{post.comments_count || 0}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
