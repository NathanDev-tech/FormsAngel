import React, { useState } from 'react';
import { CommunityPost } from '../../types/community.ts';
import { ReactionBar } from './ReactionBar.tsx';
import { CommunityCommentList } from './CommunityCommentList.tsx';
import {
  Pin,
  AlertCircle,
  MessageSquare,
  Clock,
  User,
  Paperclip,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ZoomIn,
  X,
} from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInlineComments, setShowInlineComments] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

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

  const isLongText = post.content.length > 200 || post.content.split('\n').length > 3;

  return (
    <>
      {/* Lightbox trực tiếp khi bấm xem ảnh */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="Ảnh đính kèm"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

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
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug font-serif"
          >
            {post.title}
          </h3>

          {/* Nội dung bài viết hiển thị trực tiếp (Có nút Xem thêm / Thu gọn inline) */}
          <div className="mt-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
            <p className={`whitespace-pre-line ${!isExpanded && isLongText ? 'line-clamp-3' : ''}`}>
              {post.content}
            </p>

            {isLongText && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                <span>{isExpanded ? 'Thu gọn bài viết' : 'Xem toàn bộ bài viết...'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Image Attachment Preview - Bấm trực tiếp mở Lightbox xem ảnh lớn */}
          {imageAttachment && (
            <div 
              onClick={() => setLightboxUrl(imageAttachment.file_url)}
              className="mt-3.5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 cursor-zoom-in relative group/img flex items-center justify-center p-1.5"
            >
              <img 
                src={imageAttachment.file_url} 
                alt={imageAttachment.file_name} 
                className="w-full max-h-[420px] object-contain rounded-xl group-hover/img:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md group-hover/img:bg-sky-600 transition-colors">
                <ZoomIn className="w-4 h-4" />
                <span>Xem ảnh lớn</span>
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

          {/* Right: Reactions & Inline Comments Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <ReactionBar
              postId={post.id}
              reactionsCount={post.reactions_count}
              userReactions={post.user_reactions}
              onReactionChange={onReactionChange}
            />

            <button
              type="button"
              onClick={() => setShowInlineComments(!showInlineComments)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                showInlineComments
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments_count || 0} bình luận</span>
              {showInlineComments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* Khung bình luận hiển thị trực tiếp Inline ngay dưới bài viết */}
        {showInlineComments && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fadeIn">
            <CommunityCommentList
              postId={post.id}
              commentsEnabled={post.comments_enabled}
              onCommentCountChange={() => {
                if (onReactionChange) onReactionChange();
              }}
            />
          </div>
        )}
      </article>
    </>
  );
};
