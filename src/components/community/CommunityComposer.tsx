import React, { useState } from 'react';
import { CommunityPost, CreatePostInput, COMMUNITY_CATEGORIES, CommunityCategory } from '../../types/community.ts';
import { X, Send, Paperclip, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface CommunityComposerProps {
  initialPost?: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePostInput) => Promise<boolean>;
}

export const CommunityComposer: React.FC<CommunityComposerProps> = ({
  initialPost,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialPost?.title || '');
  const [category, setCategory] = useState<string>(initialPost?.category || COMMUNITY_CATEGORIES[0]);
  const [authorName, setAuthorName] = useState(initialPost?.author_name || 'Trưởng Ca Đoàn');
  const [content, setContent] = useState(initialPost?.content || '');
  const [isPinned, setIsPinned] = useState(initialPost?.is_pinned || false);
  const [isImportant, setIsImportant] = useState(initialPost?.is_important || false);
  const [commentsEnabled, setCommentsEnabled] = useState(initialPost?.comments_enabled ?? true);
  
  // Attachments state
  const [attachments, setAttachments] = useState<{ file_name: string; file_url: string; file_type: string; file_size?: string }[]>(
    initialPost?.attachments?.map(a => ({
      file_name: a.file_name,
      file_url: a.file_url,
      file_type: a.file_type,
      file_size: a.file_size,
    })) || []
  );

  const [newAttName, setNewAttName] = useState('');
  const [newAttUrl, setNewAttUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddAttachment = () => {
    if (!newAttUrl.trim()) return;
    const name = newAttName.trim() || 'File_dinh_kem_' + (attachments.length + 1);
    const type = newAttUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ? 'image' : 'file';

    setAttachments(prev => [...prev, {
      file_name: name,
      file_url: newAttUrl.trim(),
      file_type: type,
    }]);

    setNewAttName('');
    setNewAttUrl('');
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề bài viết.');
      return;
    }

    if (!content.trim()) {
      setErrorMsg('Vui lòng nhập nội dung bài viết.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        title: title.trim(),
        category,
        author_name: authorName.trim() || 'Trưởng Ca Đoàn',
        content: content.trim(),
        is_pinned: isPinned,
        is_important: isImportant,
        comments_enabled: commentsEnabled,
        attachments,
      });

      if (ok) {
        onClose();
      } else {
        setErrorMsg('Không thể lưu bài viết, vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi Submit Composer:', err);
      setErrorMsg('Đã xảy ra lỗi hệ thống.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
            {initialPost ? '📝 Chỉnh Sửa Bài Viết' : '🗣️ Đăng Bài Viết Mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tiêu đề bài viết <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: 📢 LỊCH TẬP HÁT TUẦN NÀY..."
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Category & Author Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Danh mục
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {COMMUNITY_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tác giả hiển thị
              </label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Trưởng Ca Đoàn"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nội dung bài viết <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Nhập nội dung chi tiết thông báo, lịch hoạt động..."
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden leading-relaxed resize-y"
            />
          </div>

          {/* Attachments UI */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-amber-500" />
              <span>Ảnh & Tệp đính kèm (URL)</span>
            </label>

            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="text"
                value={newAttName}
                onChange={e => setNewAttName(e.target.value)}
                placeholder="Tên file (vd: Lich_Thang_9.png)"
                className="sm:w-1/3 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
              />
              <input
                type="url"
                value={newAttUrl}
                onChange={e => setNewAttUrl(e.target.value)}
                placeholder="Đường dẫn ảnh/file URL (https://...)"
                className="sm:w-2/3 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold shrink-0 hover:bg-sky-700 transition-colors flex items-center gap-1 justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {att.file_name} ({att.file_url})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options Checkboxes */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={e => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>📌 Ghim bài ở đầu trang</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={e => setIsImportant(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>⚠️ Đánh dấu Quan trọng</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={commentsEnabled}
                onChange={e => setCommentsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>💬 Cho phép bình luận</span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{initialPost ? 'Lưu Thay Đổi' : 'Đăng Bài Viết'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
