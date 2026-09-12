import React from 'react';
import { Sparkles, Music } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface PublicFormLayoutProps {
  children: React.ReactNode;
}

export const PublicFormLayout: React.FC<PublicFormLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Banner Accent Stripe */}
      <div className="h-2 sm:h-2.5 w-full bg-gradient-to-r from-sky-400 via-amber-300 to-indigo-600 shadow-xs" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl sm:max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-950/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden shadow-sm ring-2 ring-amber-400/40 shrink-0 bg-slate-900 flex items-center justify-center p-0.5 bg-gradient-to-br from-sky-400 to-indigo-600">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="FormsAngel Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800 dark:text-amber-300 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                <span>Giáo Xứ Bắc Hòa • Ca Đoàn Thiên Thần</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight flex items-center gap-2">
                <span>FormsAngel</span>
                <span className="text-xs font-sans font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800">
                  Public Form
                </span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 italic">
            <Music className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>"Hát là cầu nguyện hai lần"</span>
          </div>
        </div>

        {/* Dynamic Page Content (Form / Success / Error / Closed) */}
        {children}
      </main>

      {/* Public Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-800/80 mt-auto bg-white/40 dark:bg-slate-900/40">
        <p className="flex items-center justify-center gap-1 flex-wrap px-4">
          <span>Phụng sự bởi</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">FormsAngel — Ca Đoàn Thiên Thần</span>
          <span>•</span>
          <span>Giáo Xứ Bắc Hòa</span>
        </p>
      </footer>
    </div>
  );
};
