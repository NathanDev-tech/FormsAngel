import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Pin, 
  AlertTriangle, 
  Share2, 
  Check, 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Sparkles,
  Globe
} from 'lucide-react';
import { Announcement } from '../../types/announcements.ts';
import { getAnnouncementBySlug } from '../../lib/announcementsApi.ts';

export const AnnouncementDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [aspectClass, setAspectClass] = useState<'aspect-video' | 'aspect-square' | 'aspect-[4/5]'>('aspect-video');
  
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await getAnnouncementBySlug(slug);
        setAnnouncement(item);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết thông báo:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > 1.25) {
        setAspectClass('aspect-video');
      } else if (ratio < 0.8) {
        setAspectClass('aspect-[4/5]');
      } else {
        setAspectClass('aspect-square');
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        user: 'Bạn',
        text: newComment.trim(),
        time: 'Vừa xong',
      },
    ]);
    setNewComment('');
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-72 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Không tìm thấy thông báo
        </h2>
        <p className="text-sm text-slate-500">
          Bài viết này không tồn tại hoặc đã được gỡ xuống.
        </p>
        <Link
          to="/portal/thong-bao"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách thông báo</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-16 px-1 sm:px-0">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/portal/thong-bao')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-amber-400 transition-colors shadow-sm min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Bản tin thông báo</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`p-2.5 rounded-2xl text-xs font-bold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border ${
              saved
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400'
            }`}
            title="Lưu bài viết"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-extrabold transition-all shadow-sm shadow-amber-500/15 min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã chép link' : 'Chia sẻ'}</span>
          </button>
        </div>
      </div>

      {/* Main Facebook Post Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 text-left">
        
        {/* Facebook Author Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-base flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-white dark:border-slate-800">
                B
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                {(!announcement.created_by || announcement.created_by === 'Ban Quản Trị')
                  ? 'Ban Điều Hành Ca Đoàn Thiên Thần'
                  : announcement.created_by}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span>{formatDate(announcement.published_at)}</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Công khai</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {announcement.is_pinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Pin className="w-2.5 h-2.5 rotate-45" />
                Ghim
              </span>
            )}
            {announcement.is_important && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-2.5 h-2.5" />
                Hot
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
          {announcement.title}
        </h1>

        {/* Detailed Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
          {announcement.content}
        </div>

        {/* Dynamic Image - Full Uncropped Poster View */}
        {announcement.cover_image_url && (
          <div className="w-full rounded-2xl overflow-hidden bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
            <img
              src={announcement.cover_image_url}
              alt={announcement.title}
              onLoad={handleImageLoad}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
        )}

        {/* Reaction Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all min-h-[42px] ${
              liked
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500/10 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{liked ? 'Đã thích' : 'Thích'} ({likeCount})</span>
          </button>

          <span className="text-xs font-medium text-slate-400">
            {comments.length} bình luận
          </span>
        </div>

      </div>

      {/* Facebook Comments Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 text-left">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Bình luận ({comments.length})
        </h3>

        {/* Form */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all min-h-[38px] flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* List */}
        <div className="space-y-2.5 pt-1">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {c.user.charAt(0)}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/70 px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-750 text-xs space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">{c.user}</span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-sans leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </article>
  );
};
