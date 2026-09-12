import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Key, GitBranch, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { syncService, GitHubConfig } from '../lib/syncService.ts';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<GitHubConfig>(syncService.getConfig());
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(syncService.getConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    syncService.saveConfig(config);
    if (onConfigSaved) onConfigSaved();
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Tạm lưu cấu hình thử nghiệm
      syncService.saveConfig(config);
      const res = await syncService.fetchRemoteData(true);
      if (res !== null) {
        setTestResult({
          success: true,
          message: `Kết nối thành công! Tìm thấy ${res.length} ca viên trên GitHub Cloud.`,
        });
      } else {
        // Kiểm tra xem public access hay token có vấn đề
        if (!config.token) {
          setTestResult({
            success: true,
            message: 'Đang dùng chế độ Đọc công khai từ GitHub Repo (Cần nhập Token để Ghi dữ liệu).',
          });
        } else {
          setTestResult({
            success: false,
            message: 'Không thể tải dữ liệu từ GitHub. Kiểm tra Token hoặc tên Repo.',
          });
        }
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Kết nối thất bại. Vui lòng kiểm tra lại.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sky-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <RefreshCw className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                Cấu Hình Đồng Bộ GitHub Real-time
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              </h3>
              <p className="text-xs text-sky-100">
                Đồng bộ tự động dữ liệu ca đoàn tức thì giữa nhiều máy & trình duyệt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* GitHub Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-sky-500" />
                GitHub Personal Access Token (PAT)
              </label>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Cách tạo Token miễn phí?
              </button>
            </div>

            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value.trim() })}
                placeholder="github_pat_xxxx..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm pr-10 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Hướng dẫn tạo Token nếu bấm vào nút help */}
          {showGuide && (
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-xs text-sky-900 dark:text-sky-200 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                3 bước tạo GitHub Token (chỉ mất 30 giây):
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Truy cập <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer" className="underline font-semibold">GitHub Settings &gt; Developer Settings &gt; Fine-grained tokens</a>.</li>
                <li>Bấm <strong>Generate new token</strong>, chọn Repository: <code>FormsAngel</code>.</li>
                <li>Tại mục <strong>Repository permissions</strong>, chọn <strong>Contents</strong> &gt; <code>Read and write</code>, rồi bấm <strong>Generate token</strong> và dán mã vào đây.</li>
              </ol>
            </div>
          )}

          {/* Repository Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-sky-500" />
                Tên Chủ Repo (Owner)
              </label>
              <input
                type="text"
                value={config.owner}
                onChange={(e) => setConfig({ ...config, owner: e.target.value.trim() })}
                placeholder="NathanDev-tech"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tên Repository
              </label>
              <input
                type="text"
                value={config.repo}
                onChange={(e) => setConfig({ ...config, repo: e.target.value.trim() })}
                placeholder="FormsAngel"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Đường dẫn File dữ liệu
              </label>
              <input
                type="text"
                value={config.filePath}
                onChange={(e) => setConfig({ ...config, filePath: e.target.value.trim() })}
                placeholder="data/members.json"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                GitHub Gist ID (Tùy chọn)
              </label>
              <input
                type="text"
                value={config.gistId || ''}
                onChange={(e) => setConfig({ ...config, gistId: e.target.value.trim() })}
                placeholder="Ví dụ: a1b2c3d4..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tự động kiểm tra & cập nhật Real-time (Auto Polling)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Liên tục kéo dữ liệu mới mỗi 8s để đảm bảo mọi thiết bị đều nhìn thấy ca viên mới.
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.autoSync}
              onChange={(e) => setConfig({ ...config, autoSync: e.target.checked })}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
            />
          </div>

          {/* Kết quả Test */}
          {testResult && (
            <div
              className={`p-3 rounded-xl flex items-start gap-2 text-xs ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra Kết nối'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-md shadow-sky-500/20 transition-all"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
