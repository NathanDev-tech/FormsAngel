import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  UserPlus, 
  BarChart3, 
  Moon, 
  Sun, 
  Layers, 
  Bell, 
  Calendar, 
  Church, 
  Globe,
  Menu,
  X,
  Music
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export type AdminTabType = 'list' | 'form' | 'stats' | 'announcements' | 'schedules' | 'liturgy' | 'forms';

interface HeaderProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  totalMembers: number;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalMembers,
  darkMode,
  setDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100/80 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 shadow-sm">
      {/* Golden & Sky Angelic Top Gradient Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-amber-300 via-indigo-500 to-sky-600 dark:from-sky-600 dark:via-amber-400/50 dark:to-indigo-600" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-3 min-w-0">
          
          {/* BRAND IDENTITY (LEFT): LOGO + FULL PARISH BADGES + TITLE + SLOGAN */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            {/* Logo */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md ring-2 ring-amber-400/80 dark:ring-amber-500/50 p-0.5 bg-gradient-to-br from-amber-300 via-sky-400 to-indigo-600">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Logo Ca Đoàn Thiên Thần"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 text-amber-400 dark:text-amber-300">
                <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Title & Parish Metadata & Slogan */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white font-serif whitespace-nowrap">
                  Ca Đoàn Thiên Thần — Ban Điều Hành
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-ping" />
                  <span>Giáo Phận Xuân Lộc</span>
                  <span className="text-amber-400 dark:text-amber-600">•</span>
                  <span>Giáo Hạt Phú Thịnh</span>
                  <span className="text-amber-400 dark:text-amber-600">•</span>
                  <span className="font-bold text-amber-900 dark:text-amber-200">Giáo Xứ Bắc Hòa</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                <Music className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="italic font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  "Hát là cầu nguyện hai lần" — Thánh Augustinô
                </span>
              </div>
            </div>
          </div>

          {/* PAGE NAVIGATION TABS (INLINE ON THE SAME HORIZONTAL ROW) */}
          <div className="hidden lg:flex items-center shrink-0">
            <nav 
              className="flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-inner gap-0.5"
              aria-label="Thanh điều hướng Ban Điều Hành"
            >
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'list'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md font-extrabold border border-sky-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Ca Viên</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-500 text-white font-black">{totalMembers}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'form'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-md font-extrabold border border-emerald-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ghi Danh</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-md font-extrabold border border-purple-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                <span>Thống Kê</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('announcements')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'announcements'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-md font-extrabold border border-amber-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Thông Báo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schedules')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'schedules'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-md font-extrabold border border-indigo-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Lịch Tập</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('liturgy')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'liturgy'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md font-extrabold border border-sky-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Church className="w-3.5 h-3.5 text-sky-500" />
                <span>Lịch Phục Vụ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('forms')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                  activeTab === 'forms'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-md font-extrabold border border-teal-100 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-500" />
                <span>Biểu Mẫu</span>
              </button>
            </nav>
          </div>

          {/* RIGHT ACTIONS: PORTAL LINK & DARK MODE */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap min-h-[34px]"
              title="Mở Cổng Thông Tin Ca Đoàn"
            >
              <Globe className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              <span>Cổng Thông Tin ↗</span>
            </a>

            <button
              type="button"
              onClick={() => setDarkMode(prev => !prev)}
              className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs min-h-[34px] min-w-[34px] flex items-center justify-center"
              title="Chuyển đổi Giao diện Sáng / Tối"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>

            {/* Mobile Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-amber-500" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY FOR ADMIN */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-base text-slate-900 dark:text-white">Ban Điều Hành Ca Đoàn</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('list'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'list' ? 'bg-sky-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Users className="w-5 h-5" />
                  <span>Danh Sách Ca Viên ({totalMembers})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('form'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'form' ? 'bg-sky-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Ghi Danh Ca Viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('stats'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'stats' ? 'bg-sky-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Thống Kê Báo Cáo</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('announcements'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'announcements' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Quản Lý Thông Báo</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('schedules'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'schedules' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Quản Lý Lịch Tập</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('liturgy'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'liturgy' ? 'bg-sky-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Church className="w-5 h-5" />
                  <span>Quản Lý Lịch Phục Vụ</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('forms'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === 'forms' ? 'bg-rose-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Layers className="w-5 h-5" />
                  <span>Quản Lý Biểu Mẫu</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <a
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold shadow-md"
              >
                <Globe className="w-4 h-4" />
                <span>Mở Cổng Thông Tin Ca Đoàn ↗</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
