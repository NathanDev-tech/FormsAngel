import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Tag, 
  Pin, 
  AlertTriangle, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Check, 
  Send,
  MoreHorizontal,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Announcement } from '../../types/announcements.ts';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
}) => {
  // Auto aspect ratio state detected from image natural dimensions
  const [aspectClass, setAspectClass] = useState<'aspect-video' | 'aspect-square' | 'aspect-[4/5]'>('aspect-video');
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([]);
  const [newComment, setNewComment] = useState('');

  // Auto-detect image aspect ratio when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > 1.25) {
        setAspectClass('aspect-video'); // 16:9
      } else if (ratio < 0.8) {
        setAspectClass('aspect-[4/5]'); // Dọc 4:5
      } else {
        setAspectClass('aspect-square'); // 1:1 Vuông
      }
    }
  };

  const formatDateFB = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
      
      if (diffMinutes < 5) return 'Vừa xong';
      if (diffMinutes < 60) return `${diffMinutes} phút trước`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
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

  const handleShare = () => {
    const url = `${window.location.origin}/portal/thong-bao/${announcement.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const fullText = announcement.content || '';
  const needsExpansion = fullText.length > 220;

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden text-left font-sans">
      
      {/* Facebook Post Header */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        
        <div className="flex items-center gap-3">
          {/* Avatar with Verified Badge */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-white dark:border-slate-800">
              B
            </div>
            {/* Verified Blue Check Badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
          </div>

          {/* Author info */}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                {(!announcement.created_by || announcement.created_by === 'Ban Quản Trị')
                  ? 'Ban Điều Hành Ca Đoàn Thiên Thần'
                  : announcement.created_by}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              <span>{formatDateFB(announcement.published_at)}</span>
              <span>•</span>
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Công khai</span>
            </div>
          </div>
        </div>

        {/* Top Badges (Pin / Category) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {announcement.is_pinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Pin className="w-2.5 h-2.5 rotate-45" />
              Ghim
            </span>
          )}
          {announcement.is_important && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-2.5 h-2.5" />
              Hot
            </span>
          )}
        </div>

      </div>

      {/* Post Content / Body */}
      <div className="px-4 sm:px-5 space-y-2 pb-3">
        
        {/* Post Title */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          <Link to={`/portal/thong-bao/${announcement.slug}`} className="hover:text-amber-500 transition-colors">
            {announcement.title}
          </Link>
        </h2>

        {/* Post Text with Inline "Xem thêm" */}
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {expanded || !needsExpansion ? fullText : `${fullText.slice(0, 220)}... `}
          {needsExpansion && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline ml-1 inline-flex items-center"
            >
              Xem thêm
            </button>
          )}
        </div>

      </div>

      {/* Auto-detected Image Container - Never crops poster flyer content */}
      {announcement.cover_image_url && (
        <div className="w-full bg-slate-950/95 relative overflow-hidden border-y border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
          <img
            src={announcement.cover_image_url}
            alt={announcement.title}
            onLoad={handleImageLoad}
            className="w-full h-auto max-h-[580px] object-contain transition-transform duration-300 hover:scale-[1.01]"
            loading="lazy"
          />
        </div>
      )}

      {/* Facebook Reaction Stats Bar */}
      <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800/80">
        
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-sm">
            ❤️
          </span>
          <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-sm -ml-2 border-2 border-white dark:border-slate-900">
            👍
          </span>
          <span className="text-slate-600 dark:text-slate-400 font-bold ml-1">
            {likeCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline text-slate-500 dark:text-slate-400"
          >
            {comments.length} bình luận
          </button>
          <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="text-slate-500 dark:text-slate-400">{announcement.category}</span>
        </div>

      </div>

      {/* Facebook Action Buttons (Thích, Bình luận, Chia sẻ) */}
      <div className="px-2 sm:px-4 py-1 grid grid-cols-3 gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[42px] ${
            liked ? 'text-rose-500 font-extrabold' : ''
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{liked ? 'Đã thích' : 'Thích'}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[42px]"
        >
          <MessageSquare className="w-4 h-4 text-sky-500" />
          <span>Bình luận</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[42px]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-amber-500" />}
          <span>{copied ? 'Đã chép link' : 'Chia sẻ'}</span>
        </button>

      </div>

      {/* Facebook Quick Comment Section */}
      {showComments && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fade-in">
          
          {/* Comment list */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {c.user.charAt(0)}
                </div>
                <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs space-y-0.5 flex-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white">{c.user}</span>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-sans">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 px-4 py-2 rounded-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </article>
  );
};
