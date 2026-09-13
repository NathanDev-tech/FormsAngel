import React, { useState } from 'react';
import { CommunityPost } from '../../types/community.ts';
import { ReactionBar } from './ReactionBar.tsx';
import { CommunityCommentList } from './CommunityCommentList.tsx';
import { X, Pin, AlertCircle, Clock, User, Download, ExternalLink, Paperclip } from 'lucide-react';

interface CommunityPostDetailProps {
  post: CommunityPost;
  onClose: () => void;
  isAdmin?: boolean;
  onPostUpdate?: () => void;
}

export const CommunityPostDetail: React.FC<CommunityPostDetailProps> = ({
  post,
  onClose,
  isAdmin = false,
  onPostUpdate,
}) => {
  const [commentCount, setCommentCount] = useState<number>(post.comments_count || 0);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Container Card */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
              {post.category}
            </span>
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                <Pin className="w-3.5 h-3.5 fill-amber-500" />
                <span>Ghim</span>
              </span>
            )}
            {post.is_important && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Quan trọng</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Post Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif leading-snug">
              {post.title}
            </h2>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-500" />
                {post.author_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>

          {/* Main Post Text */}
          <div className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-sans border-t border-slate-100 dark:border-slate-800/80 pt-4">
            {post.content}
          </div>

          {/* Attachments Section */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-amber-500" />
                <span>File & Ảnh đính kèm ({post.attachments.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.attachments.map(att => {
                  const isImg = att.file_type === 'image' || att.file_url.match(/\.(jpeg|jpg|gif|png|webp)/i);

                  return (
                    <div
                      key={att.id}
                      className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                    >
                      {isImg ? (
                        <div className="rounded-xl overflow-hidden max-h-48 bg-slate-200 dark:bg-slate-900">
                          <img
                            src={att.file_url}
                            alt={att.file_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {att.file_name}
                          </p>
                          {att.file_size && (
                            <p className="text-[10px] text-slate-400">{att.file_size}</p>
                          )}
                        </div>

                        <a
                          href={att.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-200 transition-colors shrink-0"
                          title="Mở file"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reaction Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Thả cảm xúc:
            </span>
            <ReactionBar
              postId={post.id}
              reactionsCount={post.reactions_count}
              userReactions={post.user_reactions}
              onReactionChange={onPostUpdate}
            />
          </div>

          {/* Comments Section */}
          <CommunityCommentList
            postId={post.id}
            commentsEnabled={post.comments_enabled}
            isAdmin={isAdmin}
            onCommentCountChange={newCount => {
              setCommentCount(newCount);
              if (onPostUpdate) onPostUpdate();
            }}
          />

        </div>
      </div>
    </div>
  );
};
