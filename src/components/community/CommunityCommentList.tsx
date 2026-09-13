import React, { useState, useEffect } from 'react';
import { CommunityComment } from '../../types/community.ts';
import { CommunityCommentItem } from './CommunityCommentItem.tsx';
import { getComments, createComment, deleteComment } from '../../lib/communityApi.ts';
import { validateCommentInput, recordCommentSent, MAX_COMMENT_LENGTH } from '../../utils/visitor.ts';
import { MessageSquare, Send, MessageCircle, AlertCircle } from 'lucide-react';

interface CommunityCommentListProps {
  postId: string;
  commentsEnabled?: boolean;
  isAdmin?: boolean;
  onCommentCountChange?: (newCount: number) => void;
}

export const CommunityCommentList: React.FC<CommunityCommentListProps> = ({
  postId,
  commentsEnabled = true,
  isAdmin = false,
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState(() => {
    try {
      return localStorage.getItem('community_last_author_name') || '';
    } catch {
      return '';
    }
  });
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCommentsList = async () => {
    setLoading(true);
    try {
      const data = await getComments(postId);
      setComments(data);
      if (onCommentCountChange) {
        // Count total comments including replies
        const countTotal = (items: CommunityComment[]): number => {
          let total = 0;
          for (const item of items) {
            total += 1;
            if (item.replies && item.replies.length > 0) {
              total += countTotal(item.replies);
            }
          }
          return total;
        };
        onCommentCountChange(countTotal(data));
      }
    } catch (err) {
      console.error('Lỗi khi tải bình luận:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommentsList();
  }, [postId]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validateCommentInput(content);
    if (!validation.valid) {
      setErrorMsg(validation.message || 'Lỗi nhập dữ liệu.');
      return;
    }

    const finalName = authorName.trim() || 'Ca viên';
    try {
      localStorage.setItem('community_last_author_name', finalName);
    } catch {}

    setIsSubmitting(true);
    try {
      await createComment(postId, finalName, content.trim());
      recordCommentSent();
      setContent('');
      await loadCommentsList();
    } catch (err) {
      console.error('Lỗi khi tạo bình luận:', err);
      setErrorMsg('Không thể gửi bình luận, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (parentCommentId: string, replyName: string, replyContent: string): Promise<boolean> => {
    try {
      await createComment(postId, replyName, replyContent, parentCommentId);
      await loadCommentsList();
      return true;
    } catch (err) {
      console.error('Lỗi khi gửi reply:', err);
      return false;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      await deleteComment(commentId);
      await loadCommentsList();
    } catch (err) {
      console.error('Lỗi khi xóa bình luận:', err);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-sky-500" />
          <span>Bình luận ({comments.length})</span>
        </h3>
        {!commentsEnabled && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Bài viết đã khóa bình luận</span>
          </span>
        )}
      </div>

      {/* Main Comment Form */}
      {commentsEnabled ? (
        <form onSubmit={handleCreateComment} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-3 shadow-inner">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Viết bình luận của bạn
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Tên hiển thị:
            </label>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="VD: Nguyễn Minh"
              maxLength={50}
              className="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Nội dung bình luận:
              </label>
              <span className="text-[10px] text-slate-400">
                {content.length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
            <textarea
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Nhập nội dung bình luận tại đây..."
              maxLength={MAX_COMMENT_LENGTH}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Gửi bình luận</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50">
          Chức năng bình luận đã bị tắt đối với bài viết này.
        </div>
      )}

      {/* Comment Feed */}
      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
          <span>Đang tải bình luận...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 italic">
          Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <CommunityCommentItem
              key={c.id}
              comment={c}
              postId={postId}
              onSendReply={handleSendReply}
              onDeleteComment={handleDeleteComment}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
