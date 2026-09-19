import React, { useState, useEffect } from 'react';
import { Image, Upload, FileText, Music, Trash2, ExternalLink, Plus } from 'lucide-react';
import { MediaAsset } from '../../types/portal.ts';
import { getMediaAssets, createMediaAsset, deleteMediaAsset } from '../../lib/mediaApi.ts';
import { ConfirmDialogModal } from './ConfirmDialogModal.tsx';

export const MediaManager: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadUrl, setUploadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [mimeType, setMimeType] = useState('image/jpeg');

  // Delete modal state
  const [deletingAsset, setDeletingAsset] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getMediaAssets();
      setAssets(data);
    } catch (err) {
      console.error('Lỗi khi tải thư viện media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim() || !fileName.trim()) return;

    try {
      await createMediaAsset({
        file_name: fileName.trim(),
        storage_path: uploadUrl.trim(),
        public_url: uploadUrl.trim(),
        mime_type: mimeType,
        file_size: 1048576,
        uploaded_by: 'Admin',
      });
      setUploadUrl('');
      setFileName('');
      fetchMedia();
    } catch (err) {
      console.error('Lỗi thêm file media:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAsset) return;
    setIsDeleting(true);
    try {
      await deleteMediaAsset(deletingAsset.id);
      setDeletingAsset(null);
      fetchMedia();
    } catch (err) {
      console.error('Lỗi khi xóa file media:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white shadow-xl space-y-1">
        <div className="flex items-center gap-2 text-amber-400">
          <Image className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Ban Điều Hành</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Thư Viện Tài Liệu & Âm Nhạc
        </h2>
        <p className="text-xs text-slate-400">
          Quản lý tập tin lưu trữ và đính kèm vào bài viết thông báo, lịch tập và bài hát phụng vụ.
        </p>
      </div>

      {/* Add Media Card */}
      <form onSubmit={handleAddMedia} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-500" />
          <span>Thêm Tài Liệu / File Âm Nhạc Mới</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Tên File
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="VD: sheet-nhac-thang-9.pdf"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Đường Dẫn File Trực Tuyến (URL)
            </label>
            <input
              type="url"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Định Dạng File
            </label>
            <select
              value={mimeType}
              onChange={(e) => setMimeType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="image/jpeg">Hình ảnh (JPG/PNG)</option>
              <option value="application/pdf">Bản nhạc Sheet PDF</option>
              <option value="audio/mpeg">Audio MP3</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm File Vào Thư Viện</span>
          </button>
        </div>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="truncate max-w-[180px] font-bold text-slate-900 dark:text-white">{asset.file_name}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">{asset.mime_type.split('/')[1]}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">Người tải: {asset.uploaded_by || 'Admin'}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={asset.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 text-xs font-bold inline-flex items-center gap-1 hover:underline"
              >
                <span>Xem file</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setDeletingAsset(asset)}
                className="p-1.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={!!deletingAsset}
        title="Xác Nhận Xóa File Tài Liệu"
        message={`Bạn có chắc chắn muốn xóa file "${deletingAsset?.file_name || ''}" khỏi thư viện? Thao tác này không thể hoàn tác.`}
        confirmLabel="Đồng Ý Xóa"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingAsset(null)}
        isDeleting={isDeleting}
      />

    </div>
  );
};
