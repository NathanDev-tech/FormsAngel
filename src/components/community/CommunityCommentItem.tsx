import React, { useState } from 'react';
import { CommunityComment } from '../../types/community.ts';
import { validateCommentInput, recordCommentSent, MAX_COMMENT_LENGTH } from '../../utils/visitor.ts';
import { MessageSquare, CornerDownRight, Trash2, Send, Clock, User } from 'lucide-react';

interface CommunityCommentItemProps {
  comment: CommunityComment;
  postId: string;
  onSendReply: (parentCommentId: string, authorName: string, content: string) => Promise<boolean>;
  onDeleteComment?: (commentId: string) => void;
  isAdmin?: boolean;
}

export const CommunityCommentItem: React.FC<CommunityCommentItemProps> = ({
  comment,
  postId,
  onSendReply,
  onDeleteComment,
  isAdmin = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyName, setReplyName] = useState(() => {
    try {
      return localStorage.getItem('community_last_author_name') || '';
    } catch {
      return '';
    }
  });
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validateCommentInput(replyContent);
    if (!validation.valid) {
      setErrorMsg(validation.message || 'Lỗi nhập dữ liệu.');
      return;
    }

    const finalName = replyName.trim() || 'Ca viên';
    try {
      localStorage.setItem('community_last_author_name', finalName);
    } catch {}

    setIsSubmitting(true);
    const success = await onSendReply(comment.id, finalName, replyContent.trim());
    setIsSubmitting(false);

    if (success) {
      recordCommentSent();
      setReplyContent('');
      setShowReplyForm(false);
    } else {
      setErrorMsg('Không thể gửi phản hồi, vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 shadow-2xs transition-colors">
        
        {/* Author Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300/60 dark:border-sky-700/60 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                {comment.author_name}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 inline-flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatTime(comment.created_at)}
              </span>
            </div>
          </div>

          {/* Admin Delete Action */}
          {isAdmin && onDeleteComment && (
            <button
              type="button"
              onClick={() => onDeleteComment(comment.id)}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-xs font-medium flex items-center gap-1"
              title="Xóa bình luận này"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xóa</span>
            </button>
          )}
        </div>

        {/* Comment Content */}
        <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line pl-0.5">
          {comment.content}
        </p>

        {/* Reply Trigger Action */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setShowReplyForm(!showReplyForm);
              setErrorMsg(null);
            }}
            className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showReplyForm ? 'Hủy trả lời' : 'Trả lời'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="ml-4 sm:ml-6 p-3 sm:p-4 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-200/80 dark:border-slate-700 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 dark:text-sky-300">
            <CornerDownRight className="w-4 h-4 text-sky-500" />
            <span>Trả lời bình luận của <strong>{comment.author_name}</strong></span>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Tên hiển thị của bạn
            </label>
            <input
              type="text"
              value={replyName}
              onChange={e => setReplyName(e.target.value)}
              placeholder="VD: Nguyễn Minh"
              maxLength={50}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Nội dung trả lời
              </label>
              <span className="text-[10px] text-slate-400">
                {replyContent.length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
            <textarea
              rows={2}
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              maxLength={MAX_COMMENT_LENGTH}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden resize-y"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Gửi trả lời</span>
            </button>
          </div>
        </form>
      )}

      {/* Nested Replies Rendering */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 sm:ml-8 pl-3 border-l-2 border-sky-200 dark:border-slate-700 space-y-3">
          {comment.replies.map(reply => (
            <CommunityCommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onSendReply={onSendReply}
              onDeleteComment={onDeleteComment}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
