import React, { useState, useRef, useCallback } from 'react';
import { CommunityPost, CreatePostInput, COMMUNITY_CATEGORIES } from '../../types/community.ts';
import { X, Send, Paperclip, Upload, Trash2, FileText, ZoomIn } from 'lucide-react';

interface CommunityComposerProps {
  initialPost?: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePostInput) => Promise<boolean>;
}

// Nén ảnh nâng cao về max 1920px và quality 0.90 để bảo toàn 100% chi tiết & độ sắc nét
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1920;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
        else { width = Math.round((width / height) * MAX); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }

      const isPng = file.type === 'image/png';
      if (!isPng) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.90));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}

export const CommunityComposer: React.FC<CommunityComposerProps> = ({
  initialPost,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [category, setCategory] = useState<string>(initialPost?.category || COMMUNITY_CATEGORIES[0]);
  const [authorName, setAuthorName] = useState(initialPost?.author_name || 'Trưởng Ca Đoàn');
  const [content, setContent] = useState(initialPost?.content || '');
  const [isPinned, setIsPinned] = useState(initialPost?.is_pinned || false);
  const [isImportant, setIsImportant] = useState(initialPost?.is_important || false);
  const [commentsEnabled, setCommentsEnabled] = useState(initialPost?.comments_enabled ?? true);

  const [attachments, setAttachments] = useState<{ file_name: string; file_url: string; file_type: string; file_size?: string }[]>(
    initialPost?.attachments?.map(a => ({
      file_name: a.file_name,
      file_url: a.file_url,
      file_type: a.file_type,
      file_size: a.file_size,
    })) || []
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setErrorMsg(null);

    try {
      const newItems = await Promise.all(
        files.map(async (file) => {
          const isImg = isImageFile(file);
          const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

          if (isImg) {
            const compressed = await compressImage(file);
            return { file_name: file.name, file_url: compressed, file_type: 'image', file_size: sizeMb };
          } else {
            return new Promise<{ file_name: string; file_url: string; file_type: string; file_size: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve({ file_name: file.name, file_url: e.target?.result as string, file_type: 'file', file_size: sizeMb });
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          }
        })
      );
      setAttachments(prev => [...prev, ...newItems]);
    } catch (err) {
      console.error('Lỗi xử lý tệp:', err);
      setErrorMsg('Không thể đọc file đã chọn. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f: File) =>
      f.type.startsWith('image/') || f.type === 'application/pdf' || /\.(doc|docx)$/i.test(f.name)
    );
    processFiles(files);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!title.trim()) { setErrorMsg('Vui lòng nhập tiêu đề bài viết.'); return; }
    if (!content.trim()) { setErrorMsg('Vui lòng nhập nội dung bài viết.'); return; }

    setIsSubmitting(true);
    try {
      const ok = await onSubmit({ title: title.trim(), category, author_name: authorName.trim() || 'Trưởng Ca Đoàn', content: content.trim(), is_pinned: isPinned, is_important: isImportant, comments_enabled: commentsEnabled, attachments });
      if (ok) { onClose(); } else { setErrorMsg('Không thể lưu bài viết, vui lòng thử lại.'); }
    } catch (err) {
      console.error('Lỗi Submit Composer:', err);
      setErrorMsg('Đã xảy ra lỗi hệ thống.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImg = (a: { file_url: string; file_type?: string }) =>
    a.file_type === 'image' ||
    a.file_url.startsWith('data:image/') ||
    /\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/i.test(a.file_url);

  const imageAtts = attachments.filter(a => isImg(a));
  const fileAtts = attachments.filter(a => !isImg(a));

  return (
    <>
      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxSrc}
            alt="Xem ảnh"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

          {/* Mobile Handle Drag Indicator */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mt-2.5 sm:hidden shrink-0" />

          {/* Modal Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
              {initialPost ? '📝 Chỉnh Sửa Bài Viết' : '🗣️ Đăng Bài Viết Mới'}
            </h3>
            <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tiêu đề <span className="text-rose-500">*</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Danh mục</label>
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tác giả</label>
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nội dung <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Nhập nội dung chi tiết thông báo, lịch hoạt động..."
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-hidden leading-relaxed resize-y"
              />
            </div>

            {/* Upload Zone */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-amber-500" />
                <span>Ảnh & Tệp đính kèm</span>
                {attachments.length > 0 && (
                  <span className="ml-auto text-[11px] font-semibold text-slate-400">{attachments.length} tệp</span>
                )}
              </label>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                multiple
                className="hidden"
              />

              {/* Drop Zone */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                disabled={isUploading}
                className={`w-full py-5 px-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  dragOver
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30'
                    : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 bg-white dark:bg-slate-900/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${dragOver ? 'scale-110 bg-sky-100 dark:bg-sky-950 text-sky-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {isUploading
                    ? <div className="w-5 h-5 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                    : <Upload className="w-5 h-5" />
                  }
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold ${dragOver ? 'text-sky-600 dark:text-sky-300' : 'text-slate-600 dark:text-slate-300'}`}>
                    {isUploading ? 'Đang xử lý & nén ảnh...' : dragOver ? '📂 Thả file vào đây!' : '📁 Nhấp hoặc kéo thả ảnh / tệp vào đây'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, GIF · PDF, Word · Ảnh được nén tự động</p>
                </div>
              </button>

              {/* Image Grid Preview */}
              {imageAtts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    🖼️ Ảnh đính kèm ({imageAtts.length})
                  </p>
                  <div className={`grid gap-2 ${imageAtts.length === 1 ? 'grid-cols-1' : imageAtts.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {imageAtts.map((att, originalIdx) => {
                      const idx = attachments.indexOf(att);
                      return (
                        <div key={originalIdx} className="relative group rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 min-h-[140px]">
                          <img
                            src={att.file_url}
                            alt={att.file_name}
                            className="w-full max-h-48 object-contain rounded-xl"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setLightboxSrc(att.file_url)}
                              className="p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white transition-colors shadow-md"
                              title="Xem ảnh lớn"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(idx)}
                              className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md"
                              title="Xóa ảnh"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {/* File size badge */}
                          {att.file_size && (
                            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                              {att.file_size}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* File List */}
              {fileAtts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    📎 Tệp đính kèm ({fileAtts.length})
                  </p>
                  <div className="space-y-1.5">
                    {fileAtts.map((att, originalIdx) => {
                      const idx = attachments.indexOf(att);
                      return (
                        <div key={originalIdx} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate flex-1">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{att.file_name}</p>
                            {att.file_size && <p className="text-[10px] text-slate-400">{att.file_size}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(idx)}
                            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors shrink-0"
                            title="Xóa tệp"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: '📌 Ghim bài đầu trang', value: isPinned, onChange: setIsPinned, color: 'text-amber-600' },
                { label: '⚠️ Đánh dấu Quan trọng', value: isImportant, onChange: setIsImportant, color: 'text-rose-600' },
                { label: '💬 Cho phép bình luận', value: commentsEnabled, onChange: setCommentsEnabled, color: 'text-emerald-600' },
              ].map(opt => (
                <label key={opt.label} className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={opt.value}
                    onChange={e => opt.onChange(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send className="w-4 h-4" />
                }
                <span>{initialPost ? 'Lưu Thay Đổi' : 'Đăng Bài Viết'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};
