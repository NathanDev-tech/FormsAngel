import React, { useState, useEffect } from 'react';
import { CommunityPost, CreatePostInput } from '../../types/community.ts';
import { getPosts, createPost, subscribeCommunityRealtime } from '../../lib/communityApi.ts';
import { CommunitySearch } from './CommunitySearch.tsx';
import { CommunityFilters } from './CommunityFilters.tsx';
import { PinnedPosts } from './PinnedPosts.tsx';
import { CommunityPostCard } from './CommunityPostCard.tsx';
import { CommunityPostDetail } from './CommunityPostDetail.tsx';
import { CommunityComposer } from './CommunityComposer.tsx';
import logoImg from '../../assets/logo.png';
import {
  Sparkles,
  Moon,
  Sun,
  Music,
  RefreshCw,
  MessageSquareDashed,
  Calendar,
  Heart,
  MessageCircle,
  ShieldCheck,
  Church,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  User,
  Plus,
  PenTool,
} from 'lucide-react';

export const CommunityHome: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Dark mode state với localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ca_doan_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ca_doan_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load posts
  const fetchPosts = async () => {
    try {
      const data = await getPosts(selectedCategory, searchQuery);
      setPosts(data);

      if (activePost) {
        const updatedActive = data.find(p => p.id === activePost.id);
        if (updatedActive) setActivePost(updatedActive);
      }
    } catch (err) {
      console.error('Lỗi tải bài viết community:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  // Đăng ký Supabase Realtime
  useEffect(() => {
    const unsub = subscribeCommunityRealtime(() => {
      fetchPosts();
    });
    return () => unsub();
  }, [selectedCategory, searchQuery]);

  // Tính tổng thống kê
  const totalComments = posts.reduce((sum, p) => sum + (p.comments_count || 0), 0);
  const totalPinned = posts.filter(p => p.is_pinned).length;

  const handleCreatePost = async (input: CreatePostInput): Promise<boolean> => {
    try {
      await createPost(input);
      await fetchPosts();
      return true;
    } catch (err) {
      console.error('Lỗi đăng bài mới từ CommunityHome:', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Standalone Community Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100/80 dark:border-slate-800 shadow-xs">
        <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-amber-300 to-indigo-500" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full p-0.5 bg-gradient-to-br from-sky-400 via-amber-300 to-indigo-600 shadow-md shrink-0 ring-2 ring-amber-400/50">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={logoImg} alt="Logo Ca Đoàn" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                  🗣️ Diễn đàn Cộng đồng
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Church className="w-3 h-3 text-amber-500" />
                  <span>Giáo Xứ Bắc Hòa</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Ca Đoàn Thiên Thần — Giáo Phận Xuân Lộc • Giáo Hạt Phú Thịnh</span>
              </p>
            </div>
          </div>

          {/* Actions: Refresh & Dark mode & Quick Post */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng Bài Mới</span>
            </button>

            <button
              type="button"
              onClick={fetchPosts}
              className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs"
              title="Làm mới nội dung"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs"
              title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Banner Welcome */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-white to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-amber-200">
                <Music className="w-3.5 h-3.5 text-amber-300" />
                <span>"Hát là cầu nguyện hai lần" — Thánh Augustino</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 backdrop-blur-md border border-emerald-300/40 text-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Diễn đàn Công khai</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
              Chào mừng quý Anh Chị Em đến với Diễn đàn Ca Đoàn Thiên Thần!
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-3xl leading-relaxed">
              Trang thông tin & thảo luận chính thức của Ca Đoàn. Nơi cập nhật các thông báo mới nhất, lịch tập hát, chương trình Thánh Lễ và giao lưu chia sẻ dành cho toàn thể ca viên và cộng đồng.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout for Desktop / Single Column Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Feed Column (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Facebook-style Composer Trigger Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(true)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm text-left rounded-2xl px-4 py-3 transition-colors flex items-center justify-between group"
                >
                  <span>Bạn muốn chia sẻ thông báo hoặc hình ảnh gì với Ca Đoàn? ✍️</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-xs group-hover:bg-sky-700 transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Đăng bài & Ảnh</span>
                  </span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-around gap-2 text-xs text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>📷 Thêm ảnh / Tệp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-400 font-bold transition-colors"
                >
                  <PenTool className="w-4 h-4 text-amber-500" />
                  <span>📢 Viết thông báo</span>
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="space-y-3">
              <CommunitySearch
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <CommunityFilters
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Pinned Posts */}
            {!searchQuery && selectedCategory === 'Tất cả' && (
              <PinnedPosts
                posts={posts}
                onSelectPost={post => setActivePost(post)}
              />
            )}

            {/* Feed Posts Header */}
            <div className="flex items-center justify-between pt-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📢 BÀI VIẾT MỚI NHẤT</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200 dark:border-sky-800">
                  {posts.length} bài
                </span>
              </h3>
            </div>

            {/* Post Feed */}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-sky-400/20 border-t-sky-500 rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-medium">Đang đồng bộ bài viết mới nhất...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3 shadow-2xs">
                <MessageSquareDashed className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-700 dark:text-slate-300">
                  Chưa tìm thấy bài viết nào
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {searchQuery
                    ? `Không có bài viết nào phù hợp với từ khóa "${searchQuery}".`
                    : 'Hiện chưa có bài viết nào trong danh mục này.'}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map(post => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onSelect={p => setActivePost(p)}
                    onReactionChange={fetchPosts}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Right Sidebar Widgets Column (lg:col-span-4) - Hidden on Mobile, Shown on Desktop */}
          <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Widget 1: Lịch Hoạt Động Nổi Bật */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>📅 LỊCH PHỤC VỤ TUẦN NÀY</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/80 space-y-1">
                  <div className="flex justify-between font-bold text-sky-800 dark:text-sky-300">
                    <span>🎵 Tập hát định kỳ</span>
                    <span>Thứ 5 & Thứ 7</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Hàng tuần tại Phòng Tập Hát</p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-amber-900 dark:text-amber-300">
                    <span>⛪ Thánh Lễ Chủ Nhật</span>
                    <span>06:30</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Thánh Đường Giáo Xứ Bắc Hòa</p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-300">
                    <span>🎉 Lễ Bổn Mạng</span>
                    <span>29/09 hằng năm</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Lễ Các Tổng Lãnh Thiên Thần</p>
                </div>
              </div>
            </div>

            {/* Widget 2: Thống Kê Diễn Đàn */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>📊 THỐNG KÊ CỘNG ĐỒNG</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400 block">{posts.length}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bài viết</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xl font-extrabold text-amber-500 block">{totalPinned}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bài ghim</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block">{totalComments}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bình luận</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xl font-extrabold text-rose-500 block">100%</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Công khai</span>
                </div>
              </div>
            </div>

            {/* Widget 3: Thông Tin Hành Chánh Giáo Xứ */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-sky-500/10 dark:from-amber-950/30 dark:to-sky-950/30 border border-amber-200/80 dark:border-amber-800/50 space-y-3 text-xs">
              <div className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-1.5">
                <Church className="w-4 h-4 text-amber-500" />
                <span>Giáo Xứ Bắc Hòa</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Ca Đoàn Thiên Thần phụng sự Thánh Nhạc tại Thánh Đường Giáo Xứ Bắc Hòa — Giáo Hạt Phú Thịnh, Giáo Phận Xuân Lộc.
              </p>
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Diễn đàn Ca Đoàn v1.0</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Thiên Thần</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Angelic Public Footer */}
      <footer className="mt-auto py-6 border-t border-sky-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Ca Đoàn Thiên Thần</span>
            <span>•</span>
            <span>Giáo Xứ Bắc Hòa</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Giáo Phận Xuân Lộc • Giáo Hạt Phú Thịnh • Phụng Sự Thánh Nhạc
          </div>
        </div>
      </footer>

      {/* Selected Post Detail Modal */}
      {activePost && (
        <CommunityPostDetail
          post={activePost}
          onClose={() => setActivePost(null)}
          onPostUpdate={fetchPosts}
        />
      )}

      {/* Post Composer Modal */}
      {isComposerOpen && (
        <CommunityComposer
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}

    </div>
  );
};
