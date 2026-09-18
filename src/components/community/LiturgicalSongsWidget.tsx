import React, { useState, useEffect } from 'react';
import { LiturgicalSongSchedule, LiturgicalColor } from '../../types/liturgical.ts';
import { getLiturgicalSongs, subscribeLiturgicalRealtime, deleteLiturgicalSong } from '../../lib/liturgicalApi.ts';
import { LiturgicalSongModal } from './LiturgicalSongModal.tsx';
import { Church, Calendar, Share2, Check, Plus, Trash2, BookOpen, Clock, Sparkles, Music } from 'lucide-react';

interface LiturgicalSongsWidgetProps {
  isAdmin?: boolean;
}

const DAY_NAMES = ['Chúa Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function getLiturgicalColorBadge(color: LiturgicalColor): { bg: string; text: string; label: string } {
  switch (color) {
    case 'green':
      return { bg: 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-300', label: '🟢 Mùa Thường Niên (Áo Xanh)' };
    case 'white':
      return { bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700', text: 'text-slate-800 dark:text-slate-200', label: '⚪ Mùa Phục Sinh / Giáng Sinh / Lễ Trọng (Áo Trắng)' };
    case 'red':
      return { bg: 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800', text: 'text-rose-800 dark:text-rose-300', label: '🔴 Lễ Chúa Thánh Thần / Tử Đạo (Áo Đỏ)' };
    case 'purple':
      return { bg: 'bg-purple-100 dark:bg-purple-950/80 border-purple-300 dark:border-purple-800', text: 'text-purple-800 dark:text-purple-300', label: '🟣 Mùa Vọng / Mùa Chay (Áo Tím)' };
    case 'rose':
      return { bg: 'bg-pink-100 dark:bg-pink-950/80 border-pink-300 dark:border-pink-800', text: 'text-pink-800 dark:text-pink-300', label: '🌸 Chúa Nhật Vui / Mừng (Áo Hồng)' };
    default:
      return { bg: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-800', label: 'Mùa Phụng Vụ' };
  }
}

export const LiturgicalSongsWidget: React.FC<LiturgicalSongsWidgetProps> = ({ isAdmin = false }) => {
  const [songs, setSongs] = useState<LiturgicalSongSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Realtime clock state (Cập nhật liên tục mỗi giây)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const fetchSongs = async () => {
    try {
      const list = await getLiturgicalSongs();
      setSongs(list);
    } catch (err) {
      console.error('Lỗi tải Lịch bài hát phụng vụ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
    const unsub = subscribeLiturgicalRealtime(() => {
      fetchSongs();
    });
    return () => unsub();
  }, []);

  // Tính toán thời gian thực tế
  const dayName = DAY_NAMES[currentTime.getDay()];
  const isTodaySunday = currentTime.getDay() === 0;
  const todayDayStr = String(currentTime.getDate()).padStart(2, '0');
  const todayMonthStr = String(currentTime.getMonth() + 1).padStart(2, '0');
  const todayYearStr = currentTime.getFullYear();
  const todayFormatted = `${todayDayStr}/${todayMonthStr}/${todayYearStr}`;
  const timeFormatted = currentTime.toLocaleTimeString('vi-VN');

  // Tìm bài hát cho Hôm Nay & bài hát cho Chúa Nhật sắp tới
  const todaySong = songs.find(s => s.event_date === todayFormatted) ||
    songs.find(s => isTodaySunday ? (s.type === 'sunday' || s.type === 'solemnity') : s.type === 'weekday') ||
    songs[0];

  const sundaySong = songs.find(s => s.type === 'sunday' || s.type === 'solemnity') ||
    songs.find(s => s.id !== todaySong?.id);

  // Sao chép danh sách bài hát 1-click cho nhóm Zalo/FB Ca Đoàn
  const handleCopyZalo = (song: LiturgicalSongSchedule) => {
    let formattedText = `🎵 LỊCH HÁT CA ĐOÀN THIÊN THẦN — GIÁO XỨ BẮC HÒA 🎵\n`;
    formattedText += `📌 ${song.title} (${song.event_date || 'Phụng vụ'})\n`;
    formattedText += `---------------------------------\n`;

    if (song.type === 'weekday') {
      // 3 mục cho Lễ Ngày Tuần
      formattedText += `1. Nhập Lễ: ${song.nhap_le || '—'}\n`;
      formattedText += `2. Dâng Lễ: ${song.dang_le || '—'}\n`;
      formattedText += `3. Hiệp Lễ: ${song.hiep_le || '—'}\n`;
    } else {
      // 5 mục cho Lễ Chúa Nhật & Lễ Trọng
      formattedText += `1. Nhập Lễ: ${song.nhap_le || '—'}\n`;
      formattedText += `2. Đáp Ca / Alleluia: ${song.dap_ca_alleluia || '—'}\n`;
      formattedText += `3. Dâng Lễ: ${song.dang_le || '—'}\n`;
      formattedText += `4. Hiệp Lễ: ${song.hiep_le || '—'}\n`;
      formattedText += `5. Kết Lễ: ${song.ket_le || '—'}\n`;
    }

    if (song.note) {
      formattedText += `---------------------------------\n📝 Ghi chú: ${song.note}\n`;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formattedText);
      } else {
        const area = document.createElement('textarea');
        area.value = formattedText;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }
      setCopiedId(song.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Lỗi chép lịch hát:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xoá Lịch bài hát "${title}"?`)) {
      await deleteLiturgicalSong(id);
      fetchSongs();
    }
  };

  // Render thẻ hiển thị bài hát (3 mục hoặc 5 mục)
  const renderSongCard = (song: LiturgicalSongSchedule, isTodayCard: boolean = false) => {
    const isWeekday = song.type === 'weekday';

    return (
      <div
        key={song.id}
        className={`rounded-3xl p-4 space-y-3.5 border transition-all ${isTodayCard
          ? 'bg-gradient-to-b from-sky-50/90 to-white dark:from-slate-800 dark:to-slate-900 border-sky-300 dark:border-sky-800 shadow-md'
          : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}
      >
        {/* Header Thẻ Bài Hát */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isTodayCard ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-600 text-white shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>HÔM NAY ({dayName.toUpperCase()})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-600 text-white shadow-xs">
                  <BookOpen className="w-3 h-3" />
                  <span>CHÚA NHẬT SẮP TỚI</span>
                </span>
              )}

              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getLiturgicalColorBadge(song.liturgical_color).bg} ${getLiturgicalColorBadge(song.liturgical_color).text}`}>
                {getLiturgicalColorBadge(song.liturgical_color).label}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-serif pt-1">
              {song.title}
            </h4>

            <p className="text-xs text-sky-700 dark:text-sky-300 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ngày cử hành: {song.event_date || 'Phụng vụ'}</span>
              <span className="text-slate-400 font-sans">({isWeekday ? 'Lễ Ngày Tuần — 3 mục' : 'Lễ Chúa Nhật & Lễ Trọng — 5 mục'})</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCopyZalo(song)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${copiedId === song.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                }`}
              title="Sao chép danh sách gửi Zalo Ca Đoàn"
            >
              {copiedId === song.id ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedId === song.id ? 'Đã chép! ✨' : 'Gửi Zalo'}</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleDelete(song.id, song.title)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                title="Xoá lịch bài hát"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Danh Sách Bài Hát Tương Ứng (3 Mục cho Weekday, 5 Mục cho Sunday) */}
        <div className="space-y-2 text-xs">

          {/* 1. Ca Nhập Lễ */}
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-800 space-y-0.5">
            <span className="font-bold text-sky-800 dark:text-sky-300 block uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Music className="w-3 h-3" /> 1. Ca Nhập Lễ
            </span>
            <p className="font-extrabold text-slate-900 dark:text-white text-sm font-serif">
              {song.nhap_le || <span className="text-slate-400 italic">Chưa chọn bài</span>}
            </p>
          </div>

          {/* 2. Đáp Ca / Alleluia (Dành cho Lễ Chúa Nhật / Lễ Trọng - 5 mục) */}
          {!isWeekday && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 space-y-0.5">
              <span className="font-bold text-amber-800 dark:text-amber-300 block uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Music className="w-3 h-3" /> 2. Đáp Ca / Alleluia
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm font-serif">
                {song.dap_ca_alleluia || <span className="text-slate-400 italic">Chưa chọn bài</span>}
              </p>
            </div>
          )}

          {/* 3. Ca Dâng Lễ */}
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-0.5">
            <span className="font-bold text-purple-800 dark:text-purple-300 block uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Music className="w-3 h-3" /> {isWeekday ? '2. Ca Dâng Lễ' : '3. Ca Dâng Lễ (Tiến Lễ)'}
            </span>
            <p className="font-extrabold text-slate-900 dark:text-white text-sm font-serif">
              {song.dang_le || <span className="text-slate-400 italic">Chưa chọn bài</span>}
            </p>
          </div>

          {/* 4. Ca Hiệp Lễ */}
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-800 space-y-0.5">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Music className="w-3 h-3" /> {isWeekday ? '3. Ca Hiệp Lễ' : '4. Ca Hiệp Lễ (Rước Lễ)'}
            </span>
            <p className="font-extrabold text-slate-900 dark:text-white text-sm font-serif">
              {song.hiep_le || <span className="text-slate-400 italic">Chưa chọn bài</span>}
            </p>
          </div>

          {/* 5. Ca Kết Lễ (Dành cho Lễ Chúa Nhật / Lễ Trọng - 5 mục) */}
          {!isWeekday && (
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-800 space-y-0.5">
              <span className="font-bold text-indigo-800 dark:text-indigo-300 block uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Music className="w-3 h-3" /> 5. Ca Kết Lễ (Tạ Ơn)
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm font-serif">
                {song.ket_le || <span className="text-slate-400 italic">Chưa chọn bài</span>}
              </p>
            </div>
          )}

        </div>

        {/* Ghi chú ca đoàn */}
        {song.note && (
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-200 block">📝 Ghi chú ca đoàn:</span>
            <p className="italic leading-relaxed">{song.note}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-100 dark:border-slate-800 p-5 shadow-xs space-y-4">

      {/* Realtime Clock Banner Header */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span>LỊCH PHỤNG VỤ CA ĐOÀN</span>
          </div>

          <div className="font-mono text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 border border-white/20">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-white/10">
          <div>
            <h3 className="text-lg font-black font-serif tracking-wide text-amber-200">
              📅 {dayName}, {todayFormatted}
            </h3>
            <p className="text-xs text-sky-100 opacity-90">
              {isTodaySunday ? 'Hôm nay là Thánh Lễ Chúa Nhật (5 mục)' : 'Hôm nay là Thánh Lễ Ngày Tuần (3 mục)'}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Soạn Bài Hát</span>
            </button>
          )}
        </div>
      </div>

      {/* Automatic Content Area */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-sky-400/20 border-t-sky-500 rounded-full animate-spin" />
          <span>Đang tải Lịch Bài Hát Phụng Vụ...</span>
        </div>
      ) : songs.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4">
          Chưa có bài hát nào được cập nhật. {isAdmin && 'Bấm "Soạn Bài Hát" để tạo ngay.'}
        </div>
      ) : (
        <div className="space-y-4">

          {/* Thẻ 1: Thánh Lễ Hôm Nay (Tự động tải 3 mục cho Tuần, 5 mục cho Chúa Nhật) */}
          {todaySong && renderSongCard(todaySong, true)}

          {/* Thẻ 2: Thánh Lễ Chúa Nhật Sắp Tới (Tự động tải sẵn nếu hôm nay là Ngày Tuần) */}
          {!isTodaySunday && sundaySong && sundaySong.id !== todaySong?.id && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                <Church className="w-4 h-4 text-amber-500" />
                <span>Chuẩn Bị Cho Chúa Nhật Tới</span>
              </div>
              {renderSongCard(sundaySong, false)}
            </div>
          )}

        </div>
      )}

      {/* Modal Soạn Bài Hát Phụng Vụ (Cho Ban Trị Sự / Admin) */}
      {isModalOpen && (
        <LiturgicalSongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchSongs}
        />
      )}

    </div>
  );
};

