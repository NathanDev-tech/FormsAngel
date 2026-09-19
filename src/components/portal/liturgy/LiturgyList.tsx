import React, { useState, useEffect } from 'react';
import { Church, Calendar, Clock, MapPin, Music, CheckCircle2, Share2, Copy } from 'lucide-react';
import { LiturgicalService } from '../../../types/portal.ts';
import { getLiturgicalServices } from '../../../lib/liturgyApi.ts';

export const LiturgyList: React.FC = () => {
  const [services, setServices] = useState<LiturgicalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getLiturgicalServices();
        setServices(data);
      } catch (err) {
        console.error('Lỗi khi tải lịch phục vụ:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getPositionLabel = (pos: string) => {
    const map: Record<string, string> = {
      nhap_le: '1. Ca Nhập Lễ',
      dap_ca: '2. Đáp Ca',
      alleluia: '3. Alleluia',
      dang_le: '4. Ca Dâng Lễ',
      hiep_le: '5. Ca Hiệp Lễ',
      ket_le: '6. Ca Kết Lễ',
      khac: 'Khác',
    };
    return map[pos] || pos;
  };

  const handleCopyZalo = (service: LiturgicalService) => {
    const formattedDate = formatDate(service.service_date);

    const positionMap: Record<string, string> = {
      nhap_le: 'Nhập Lễ',
      dap_ca: 'Đáp Ca / Alleluia',
      alleluia: 'Alleluia',
      dang_le: 'Dâng Lễ',
      hiep_le: 'Hiệp Lễ',
      ket_le: 'Kết Lễ',
      khac: 'Khác',
    };

    let songLines: string[] = [];
    if (service.songs && service.songs.length > 0) {
      const sorted = [...service.songs].sort((a, b) => a.display_order - b.display_order);
      sorted.forEach((s, idx) => {
        const posLabel = positionMap[s.song_position] || s.song_position;
        const songTitle = s.custom_title || '—';
        songLines.push(`${idx + 1}. ${posLabel}: ${songTitle}`);
      });
    }

    const textLines = [
      `🎵 BỘ LỄ CA ĐOÀN THIÊN THẦN — GIÁO XỨ BẮC HÒA 🎵`,
      `📌 ${service.title} (${formattedDate}${service.service_time ? ' - ' + service.service_time : ''})`,
      `---------------------------------`,
      ...(songLines.length > 0 ? songLines : ['Chưa có bài hát nào']),
      ...(service.notes ? [`---------------------------------`, `📝 Ghi chú: ${service.notes}`] : [])
    ];

    const copyText = textLines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyText);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = copyText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopiedId(service.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">

      {/* Banner - Centered */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 border border-slate-800 border-indigo-500/20 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full space-y-3 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Church className="w-3.5 h-3.5" />
            <span>Phục Vụ Phụng Vụ Thánh Lễ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Lịch Phục Vụ Thánh Lễ
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Danh sách Thánh lễ, thời gian cử hành Thánh Lễ của Ca Đoàn Thiên Thần.
          </p>
        </div>
      </div>

      {/* Services Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Church className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Chưa có lịch phục vụ nào</h3>
          <p className="text-sm text-slate-500">Ban Phụng Vụ sẽ cập nhật lịch phục vụ Thánh lễ sớm nhất.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 hover:border-amber-400 transition-colors flex flex-col justify-between text-left h-full w-full"
            >
              <div className="space-y-2.5 text-left">
                {/* Large Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0 mb-1">
                  <Church className="w-5 h-5" />
                </div>

                {/* Header: Vertical Stack of Date, Time, Title, Location */}
                <div className="space-y-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-left">
                  <div className="flex flex-wrap items-center gap-1.5 text-left">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(service.service_date)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {service.service_time}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug text-left">
                    {service.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium text-left">
                    <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{service.location}</span>
                  </div>
                </div>

                {/* Assigned Songs: Left-aligned right next to position label */}
                {service.songs && service.songs.length > 0 && (
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1 text-left">
                      <Music className="w-3.5 h-3.5 text-amber-500" />
                      <span>Bộ Lễ ({service.songs.length} bài)</span>
                    </h4>

                    <div className="flex flex-col space-y-1 text-left">
                      {service.songs.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-start justify-start gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-left"
                        >
                          <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">
                            {getPositionLabel(s.song_position)}:
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-left font-serif">
                            {s.custom_title || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {service.notes && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 italic bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10 text-left">
                    📝 {service.notes}
                  </div>
                )}
              </div>

              {/* Action: Copy for Zalo Button (Full Width Bottom) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyZalo(service)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer min-h-[40px]"
                  title="Sao chép danh sách bài hát bộ lễ định dạng Zalo"
                >
                  {copiedId === service.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Đã sao chép gửi Zalo!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-amber-300" />
                      <span>Sao Chép Gửi Zalo</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

