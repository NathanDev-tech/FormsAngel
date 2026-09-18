import React from 'react';
import { Sparkles, Users, UserPlus, BarChart3, Moon, Sun, Music, Layers, MessageCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface HeaderProps {
  activeTab: 'form' | 'list' | 'stats' | 'forms' | 'community';
  setActiveTab: (tab: 'form' | 'list' | 'stats' | 'forms' | 'community') => void;
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
  return (
    <header className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100/80 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300 shadow-sm">
      {/* Halo gradient top accent border */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-amber-300 to-indigo-500 dark:from-sky-600 dark:via-amber-400/50 dark:to-indigo-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
          
          {/* Left Brand Identity: Logo + Hierarchy + Title */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3.5">
              
              {/* Angelic Glowing Emblem Logo */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden shadow-sm ring-2 ring-amber-400/60 dark:ring-amber-500/40 p-0.5 bg-gradient-to-br from-sky-400 via-amber-300 to-indigo-600">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img
                      src={logoImg}
                      alt="Logo Ca Đoàn Thiên Thần"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 text-amber-400 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 fill-amber-300" />
                </div>
              </div>

              {/* Title & Hierarchy Stack */}
              <div className="flex flex-col gap-1">
                {/* Church Administrative Hierarchy Eyebrow Badge */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Giáo Phận Xuân Lộc</span>
                    <span className="text-amber-400 dark:text-amber-600">•</span>
                    <span>Giáo Hạt Phú Thịnh</span>
                    <span className="text-amber-400 dark:text-amber-600">•</span>
                    <span className="font-bold text-amber-900 dark:text-amber-200">Giáo Xứ Bắc Hòa</span>
                  </span>
                </div>

                {/* Main Title & Slogan Quote */}
                <div className="flex items-baseline gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                    Ca Đoàn Thiên Thần
                  </h1>
                </div>

                {/* Motto Subtitle */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Music className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="italic font-medium text-slate-600 dark:text-slate-300">
                    "Hát là cầu nguyện hai lần"
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="hidden sm:inline text-slate-400 dark:text-slate-500">
                    Cổng Thông Tin Ca Đoàn
                  </span>
                </div>

              </div>
            </div>

            {/* Mobile Dark Mode Toggle */}
            <div className="flex lg:hidden items-center gap-1 shrink-0">
              <button
                type="button"
                id="mobile-dark-mode-toggle"
                onClick={() => setDarkMode(prev => !prev)}
                aria-label="Chuyển đổi giao diện sáng tối"
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
              </button>
            </div>
          </div>

          {/* Right Section: Navigation Tabs & Actions */}
          <div className="flex items-center justify-center gap-2 w-full lg:w-auto">
            <nav 
              className="flex items-center justify-start sm:justify-between p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth gap-1" 
              aria-label="Thanh điều hướng chính"
            >
              <button
                type="button"
                id="tab-btn-form"
                onClick={() => setActiveTab('form')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 min-h-[38px] active:scale-95 ${
                  activeTab === 'form'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md shadow-sky-950/5 ring-1 ring-slate-200 dark:ring-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <UserPlus className="w-4 h-4 shrink-0 text-sky-500" />
                <span className="whitespace-nowrap">Đăng Ký</span>
                <span className="hidden sm:inline whitespace-nowrap">Ca Viên</span>
              </button>

              <button
                type="button"
                id="tab-btn-list"
                onClick={() => setActiveTab('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 min-h-[38px] active:scale-95 ${
                  activeTab === 'list'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md shadow-sky-950/5 ring-1 ring-slate-200 dark:ring-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-blue-500" />
                <span className="whitespace-nowrap">Danh Sách</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-colors ${
                  activeTab === 'list' 
                    ? 'bg-sky-500 text-white dark:bg-sky-500 dark:text-slate-950 shadow-2xs' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {totalMembers}
                </span>
              </button>

              <button
                type="button"
                id="tab-btn-stats"
                onClick={() => setActiveTab('stats')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 min-h-[38px] active:scale-95 ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md shadow-sky-950/5 ring-1 ring-slate-200 dark:ring-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-purple-500" />
                <span className="whitespace-nowrap">Thống Kê</span>
              </button>

              <button
                type="button"
                id="tab-btn-forms"
                onClick={() => setActiveTab('forms')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 min-h-[38px] active:scale-95 ${
                  activeTab === 'forms'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md shadow-sky-950/5 ring-1 ring-slate-200 dark:ring-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-indigo-500" />
                <span className="whitespace-nowrap">Biểu Mẫu</span>
              </button>

              <button
                type="button"
                id="tab-btn-community"
                onClick={() => setActiveTab('community')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 min-h-[38px] active:scale-95 ${
                  activeTab === 'community'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-md shadow-sky-950/5 ring-1 ring-slate-200 dark:ring-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span className="whitespace-nowrap">Diễn Đàn</span>
              </button>
            </nav>

            {/* Desktop Dark Mode Toggle */}
            <button
              type="button"
              id="desktop-dark-mode-toggle"
              onClick={() => setDarkMode(prev => !prev)}
              aria-label="Chuyển đổi giao diện sáng tối"
              className="hidden lg:flex items-center justify-center p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs"
              title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
