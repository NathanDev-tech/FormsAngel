import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  AlertCircle, 
  RefreshCw, 
  MessageSquare, 
  Flame, 
  Users,
  Sparkles
} from 'lucide-react';
import { Announcement } from '../../types/announcements.ts';
import { getAnnouncements, subscribeAnnouncementsRealtime } from '../../lib/announcementsApi.ts';
import { AnnouncementCard } from './AnnouncementCard.tsx';

export const AnnouncementList: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements('Tất cả');
      setAnnouncements(data);
    } catch (err) {
      console.error('Lỗi khi tải bảng thông báo:', err);
      setError('Không thể tải dữ liệu thông báo. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const unsub = subscribeAnnouncementsRealtime(() => {
      fetchAnnouncements();
    });
    return () => unsub();
  }, []);

  // Client search filter
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-2xl mx-auto px-1 sm:px-0">
      
      {/* Forum Community Banner - Centered */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/50 border border-slate-800 border-amber-500/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full space-y-3 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bản Tin & Thông Báo Ca Đoàn</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-serif leading-tight">
            Thông Báo Ca Đoàn
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            Kênh cập nhật lịch tập hát, thông báo phụng vụ và sự kiện mới nhất từ Ban Điều Hành Ca Đoàn Thiên Thần.
          </p>

          {/* Forum Stats Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-amber-300">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{announcements.length} Thông báo</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-rose-300">
              <Flame className="w-3.5 h-3.5" />
              <span>{announcements.filter(a => a.is_important).length} Tin quan trọng</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-sky-300">
              <Users className="w-3.5 h-3.5" />
              <span>Ban Điều Hành phát hành</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Search Bar (Categories and View Mode Switcher removed) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết thông báo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex flex-col items-center text-center space-y-3">
          <AlertCircle className="w-10 h-10" />
          <p className="font-semibold text-sm">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <Bell className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Không có bài viết thông báo nào</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Không tìm thấy thông báo nào phù hợp với từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      )}

    </div>
  );
};
