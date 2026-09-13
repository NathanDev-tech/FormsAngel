import React, { useState, useEffect, useCallback } from 'react';
import { CommunityPost } from '../../types/community.ts';
import { ReactionBar } from './ReactionBar.tsx';
import { CommunityCommentList } from './CommunityCommentList.tsx';
import { getCommunityPostShareUrl } from '../../utils/communityUtils.ts';
import { X, Pin, AlertCircle, Clock, User, ExternalLink, Paperclip, ChevronLeft, ChevronRight, ZoomIn, FileText, Share2, Check } from 'lucide-react';

interface CommunityPostDetailProps {
  post: CommunityPost;
  onClose: () => void;
  isAdmin?: boolean;
  onPostUpdate?: () => void;
}

// Hàm kiểm tra file đính kèm có phải ảnh không (hỗ trợ cả data URL và URL thông thường)
function isImageAttachment(fileUrl: string, fileType: string): boolean {
  return (
    fileType === 'image' ||
    fileUrl.startsWith('data:image/') ||
    /\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/i.test(fileUrl)
  );
}

export const CommunityPostDetail: React.FC<CommunityPostDetailProps> = ({
  post,
  onClose,
  isAdmin = false,
  onPostUpdate,
}) => {
  const [commentCount, setCommentCount] = useState<number>(post.comments_count || 0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = getCommunityPostShareUrl(post.id);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (navigator.share) {
        try {
          await navigator.share({
            title: post.title,
            text: post.content.slice(0, 100) + '...',
            url: shareUrl,
          });
        } catch {
          // Native share dismissed
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Lỗi chia sẻ bài viết:', err);
    }
  };

  const imageAtts = (post.attachments || []).filter(a => isImageAttachment(a.file_url, a.file_type));
  const fileAtts = (post.attachments || []).filter(a => !isImageAttachment(a.file_url, a.file_type));

  // Keyboard navigation cho lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % imageAtts.length : null);
    if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + imageAtts.length) % imageAtts.length : null);
  }, [lightboxIndex, imageAtts.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('vi-VN', {
        weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return isoStr; }
  };

  // Layout gallery kiểu Facebook
  const renderImageGallery = () => {
    if (imageAtts.length === 0) return null;
    const count = imageAtts.length;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-amber-500" />
          <span>Ảnh đính kèm ({count})</span>
        </h4>

        {/* Single image - full width & 100% visible */}
        {count === 1 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="group w-full flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-2 cursor-zoom-in relative"
          >
            <img
              src={imageAtts[0].file_url}
              alt={imageAtts[0].file_name}
              className="w-full max-h-[600px] object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </button>
        )}

        {/* 2 images - side by side */}
        {count === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {imageAtts.map((att, i) => (
              <button
                key={att.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-1.5 cursor-zoom-in relative min-h-[220px]"
              >
                <img
                  src={att.file_url}
                  alt={att.file_name}
                  className="w-full max-h-72 object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* 3 images */}
        {count === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {imageAtts.map((att, i) => (
              <button
                key={att.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-1.5 cursor-zoom-in relative min-h-[180px]"
              >
                <img
                  src={att.file_url}
                  alt={att.file_name}
                  className="w-full max-h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* 4 images - 2x2 grid */}
        {count === 4 && (
          <div className="grid grid-cols-2 gap-2">
            {imageAtts.map((att, i) => (
              <button
                key={att.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-1.5 cursor-zoom-in relative min-h-[180px]"
              >
                <img
                  src={att.file_url}
                  alt={att.file_name}
                  className="w-full max-h-56 object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* 5+ images */}
        {count >= 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {imageAtts.slice(0, 6).map((att, i) => (
              <button
                key={att.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-1.5 cursor-zoom-in relative min-h-[160px]"
              >
                <img
                  src={att.file_url}
                  alt={att.file_name}
                  className="w-full max-h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {i === 5 && count > 6 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                    <span className="text-white text-2xl font-extrabold drop-shadow-lg">+{count - 6}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && imageAtts.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-semibold">
            {lightboxIndex + 1} / {imageAtts.length}
          </div>

          {/* Prev */}
          {imageAtts.length > 1 && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + imageAtts.length) % imageAtts.length); }}
              className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <img
            src={imageAtts[lightboxIndex].file_url}
            alt={imageAtts[lightboxIndex].file_name}
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {imageAtts.length > 1 && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % imageAtts.length); }}
              className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Filename */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium max-w-[80vw] truncate text-center">
            {imageAtts[lightboxIndex].file_name}
          </div>

          {/* Thumbnail strip (mobile: hidden, sm+: show) */}
          {imageAtts.length > 1 && (
            <div className="hidden sm:flex absolute bottom-14 left-1/2 -translate-x-1/2 gap-2">
              {imageAtts.map((att, i) => (
                <button
                  key={att.id}
                  type="button"
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === lightboxIndex ? 'border-white scale-110' : 'border-white/30 opacity-60 hover:opacity-100'}`}
                >
                  <img src={att.file_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">

        {/* Container Card */}
        <div className="relative w-full sm:max-w-3xl bg-white dark:bg-slate-900 sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[92vh]">

          {/* Header */}
          <div className="sticky top-0 z-10 px-4 sm:px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
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
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">

            {/* Post Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif leading-snug">
                {post.title}
              </h2>
              <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
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

            {/* ===== IMAGE GALLERY (kiểu Facebook) ===== */}
            {imageAtts.length > 0 && renderImageGallery()}

            {/* ===== FILE ATTACHMENTS ===== */}
            {fileAtts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tệp đính kèm ({fileAtts.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fileAtts.map(att => (
                    <div key={att.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{att.file_name}</p>
                        {att.file_size && <p className="text-[10px] text-slate-400">{att.file_size}</p>}
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
                  ))}
                </div>
              </div>
            )}

            {/* Reaction Bar & Share Button */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
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

              <button
                type="button"
                onClick={handleShare}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                }`}
                title="Sao chép đường dẫn trực tiếp bài viết"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
                <span>{copied ? 'Đã sao chép liên kết! ✨' : 'Chia sẻ bài viết'}</span>
              </button>
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
    </>
  );
};
