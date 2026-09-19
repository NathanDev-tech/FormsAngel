import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, Save, AlertCircle, Upload, ImageIcon, Trash2 } from 'lucide-react';
import { Announcement, AnnouncementCategory, AnnouncementStatus } from '../../types/announcements.ts';
import { createAnnouncement, updateAnnouncement } from '../../lib/announcementsApi.ts';

interface AnnouncementEditorProps {
  announcement?: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Nén ảnh và chuyển sang base64 — nhanh, không cần bucket Storage
function compressImageToBase64(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas không khả dụng'));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Không đọc được file ảnh'));
    img.src = url;
  });
}

export const AnnouncementEditor: React.FC<AnnouncementEditorProps> = ({
  announcement,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Quan trọng');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isImportant, setIsImportant] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [status, setStatus] = useState<AnnouncementStatus>('published');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || '');
      setSlug(announcement.slug || '');
      setExcerpt(announcement.excerpt || '');
      setContent(announcement.content || '');
      setCategory((announcement.category as AnnouncementCategory) || 'Quan trọng');
      setCoverImageUrl(announcement.cover_image_url || '');
      setCoverImagePreview(announcement.cover_image_url || '');
      setCoverImageFile(null);
      setIsImportant(!!announcement.is_important);
      setIsPinned(!!announcement.is_pinned);
      setStatus(announcement.status || 'published');
    } else {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCategory('Quan trọng');
      setCoverImageUrl('');
      setCoverImagePreview('');
      setCoverImageFile(null);
      setIsImportant(false);
      setIsPinned(false);
      setStatus('published');
    }
  }, [announcement, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh (JPG, PNG, WebP, GIF...)');
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh không được vượt quá 5MB.');
      return;
    }

    setError(null);
    setCoverImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview('');
    setCoverImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng điền đầy đủ tiêu đề và nội dung thông báo.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = coverImageUrl;

      // Nén và chuyển ảnh sang base64 ngay trên trình duyệt — không cần upload network
      if (coverImageFile) {
        try {
          finalImageUrl = await compressImageToBase64(coverImageFile);
        } catch (imgErr) {
          console.warn('Không thể nén ảnh, bỏ qua ảnh bìa:', imgErr);
          finalImageUrl = '';
        }
      }

      if (announcement) {
        await updateAnnouncement(announcement.id, {
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
          cover_image_url: finalImageUrl,
          is_important: isImportant,
          is_pinned: isPinned,
          status,
        });
      } else {
        await createAnnouncement({
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
          cover_image_url: finalImageUrl,
          is_important: isImportant,
          is_pinned: isPinned,
          status,
          created_by: 'Ban Điều Hành Ca Đoàn Thiên Thần',
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi khi lưu thông báo:', err);
      setError('Không thể lưu thông báo. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const isProcessing = submitting;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {announcement ? 'Chỉnh Sửa Thông Báo' : 'Soạn Thông Báo Mới'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Tiêu đề thông báo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Thông Báo Chuẩn Bị Đại Lễ Phục Sinh 2026"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Quan trọng">Quan trọng</option>
                <option value="Lịch tập">Lịch tập</option>
                <option value="Phụng vụ">Phụng vụ</option>
                <option value="Sinh hoạt">Sinh hoạt</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AnnouncementStatus)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="published">Đăng công khai</option>
                <option value="draft">Lưu bản nháp</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>📌 Ghim đầu trang chủ</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
              />
              <span>⚠️ Đánh dấu Quan trọng</span>
            </label>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Ảnh Bìa
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="cover-image-upload"
            />

            {coverImagePreview ? (
              /* Preview area */
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img
                  src={coverImagePreview}
                  alt="Ảnh bìa"
                  className="w-full h-48 object-cover"
                  onError={() => {
                    setCoverImagePreview('');
                    setCoverImageUrl('');
                  }}
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30 hover:bg-white/30 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/80 backdrop-blur-sm text-white text-xs font-bold hover:bg-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa ảnh
                  </button>
                </div>
                {/* File name badge */}
                {coverImageFile && (
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-950/70 backdrop-blur-sm px-3 py-1.5">
                    <p className="text-white text-xs truncate">
                      📎 {coverImageFile.name} ({(coverImageFile.size / 1024).toFixed(0)} KB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Upload dropzone */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-colors flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-amber-500/20 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Nhấn để chọn ảnh từ thiết bị
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    JPG, PNG, WebP, GIF — Tối đa 5MB
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                  <Upload className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Chọn ảnh</span>
                </div>
              </button>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Tóm tắt ngắn (Excerpt)
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Nhập 1-2 câu tóm tắt..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Nội dung chi tiết <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Soạn thảo nội dung thông báo đầy đủ..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-sans"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {submitting ? 'Đang lưu...' : 'Lưu Thông Báo'}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
