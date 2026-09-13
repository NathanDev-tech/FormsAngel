import React from 'react';
import { CommunityPost } from '../../types/community.ts';
import { ReactionBar } from './ReactionBar.tsx';
import { Pin, AlertCircle, MessageSquare, Clock, User, Paperclip, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface CommunityPostCardProps {
  post: CommunityPost;
  onSelect: (post: CommunityPost) => void;
  onReactionChange?: () => void;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onSelect,
  onReactionChange,
}) => {
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const hasAttachments = post.attachments && post.attachments.length > 0;
  const imageAttachment = hasAttachments ? post.attachments!.find(a =>
    a.file_type === 'image' ||
    a.file_url.startsWith('data:image/') ||
    /\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/i.test(a.file_url)
  ) : null;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80">
              {post.category}
            </span>

            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Pin className="w-3 h-3 fill-amber-500" />
                <span>Ghim</span>
              </span>
            )}

            {post.is_important && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                <AlertCircle className="w-3 h-3" />
                <span>Quan trọng</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(post)}
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug font-serif"
        >
          {post.title}
        </h3>

        {/* Content Snippet */}
        <p 
          onClick={() => onSelect(post)}
          className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-line cursor-pointer"
        >
          {post.content}
        </p>

        {/* Image Attachment Preview - Hiển thị 100% trọn vẹn ảnh không bị cắt */}
        {imageAttachment && (
          <div 
            onClick={() => onSelect(post)}
            className="mt-3.5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 cursor-pointer relative group/img flex items-center justify-center p-1.5"
          >
            <img 
              src={imageAttachment.file_url} 
              alt={imageAttachment.file_name} 
              className="w-full max-h-[380px] object-contain rounded-xl group-hover/img:scale-[1.01] transition-transform duration-300"
            />
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-md">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Xem bài & ảnh đầy đủ</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta & Reactions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left: Author & Attachment indicators */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
            <User className="w-3.5 h-3.5 text-sky-500" />
            <span>{post.author_name}</span>
          </div>

          {hasAttachments && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
              <Paperclip className="w-3 h-3 text-amber-500" />
              <span>{post.attachments!.length} đính kèm</span>
            </span>
          )}
        </div>

        {/* Right: Reactions & Comment Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <ReactionBar
            postId={post.id}
            reactionsCount={post.reactions_count}
            userReactions={post.user_reactions}
            onReactionChange={onReactionChange}
          />

          <button
            type="button"
            onClick={() => onSelect(post)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments_count || 0}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

      </div>
    </article>
  );
};
