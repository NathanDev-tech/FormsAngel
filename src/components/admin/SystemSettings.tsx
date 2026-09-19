import React, { useState, useEffect } from 'react';
import { Sliders, Database, Save, CheckCircle2, Key, Globe, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase.ts';
import { getAuditLogs } from '../../lib/adminApi.ts';
import { AuditLog } from '../../types/portal.ts';

export const SystemSettings: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url || '');
    setSupabaseAnonKey(config.anonKey || '');

    async function loadLogs() {
      try {
        const logs = await getAuditLogs();
        setAuditLogs(logs);
      } catch (err) {
        console.error('Lỗi khi tải nhật ký hệ thống:', err);
      }
    }
    loadLogs();
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white shadow-xl space-y-1">
        <div className="flex items-center gap-2 text-amber-400">
          <Sliders className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Ban Điều Hành</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Cài Đặt Hệ Thống & Nhật Ký Thao Tác
        </h2>
        <p className="text-xs text-slate-400">
          Cấu hình kết nối Cơ Sở Dữ Liệu và kiểm tra nhật ký thao tác ban quản trị.
        </p>
      </div>

      {/* Database Connection Config Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Cấu Hình Kết Nối Cơ Sở Dữ Liệu</h3>
          </div>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình thành công!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Đường Dẫn Kết Nối CSDL (URL)
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Mã Khóa Kết Nối An Toàn (API Key)
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình Kết Nối</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-500" />
          <span>Nhật Ký Thao Tác Hệ Thống</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Quản trị viên</th>
                <th className="px-4 py-3">Hành động</th>
                <th className="px-4 py-3">Đối tượng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-500">
                    {log.user_id || 'Admin'}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {log.entity_type} ({log.entity_id || 'N/A'})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
