import React, { useState, useEffect } from 'react';
import { CommunityPost } from '../../types/community.ts';
import { getPosts, subscribeCommunityRealtime } from '../../lib/communityApi.ts';
import { CommunitySearch } from './CommunitySearch.tsx';
import { CommunityFilters } from './CommunityFilters.tsx';
import { PinnedPosts } from './PinnedPosts.tsx';
import { CommunityPostCard } from './CommunityPostCard.tsx';
import { CommunityPostDetail } from './CommunityPostDetail.tsx';
import logoImg from '../../assets/logo.png';
import { Sparkles, Moon, Sun, Music, RefreshCw, MessageSquareDashed } from 'lucide-react';

export const CommunityHome: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);

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

      // Nếu đang mở bài viết chi tiết, cập nhật lại dữ liệu bài đó
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

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Standalone Community Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100/80 dark:border-slate-800 shadow-xs">
        <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-amber-300 to-indigo-500" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-br from-sky-400 via-amber-300 to-indigo-600 shadow-md shrink-0">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={logoImg} alt="Logo Ca Đoàn" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                  🗣️ Diễn đàn Cộng đồng
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa</span>
              </p>
            </div>
          </div>

          {/* Actions: Refresh & Dark mode */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchPosts}
              className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors"
              title="Làm mới nội dung"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors"
              title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Banner Welcome */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white p-5 sm:p-7 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30">
              <Music className="w-3.5 h-3.5 text-amber-300" />
              <span>"Hát là cầu nguyện hai lần"</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Chào mừng quý Anh Chị Em đến với Diễn đàn Ca Đoàn!
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
              Nơi cập nhật thông báo, lịch tập hát, phục vụ Thánh Lễ và giao lưu chia sẻ cùng toàn thể ca viên Ca Đoàn Thiên Thần.
            </p>
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
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold">
              {posts.length}
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
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
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
          <div className="space-y-4">
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

      </main>

      {/* Angelic Public Footer */}
      <footer className="mt-auto py-6 border-t border-sky-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Ca Đoàn Thiên Thần</span>
            <span>•</span>
            <span>Giáo Xứ Bắc Hòa</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Giáo Phận Xuân Lộc • Giáo Hạt Phú Thịnh
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

    </div>
  );
};
