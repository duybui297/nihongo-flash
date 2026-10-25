import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  X,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { exportAllData, importData, resetAllData, clearAllData } from '../services/storage';
import { api, ClientStorageStats } from '../services/api';
import type { Flashcard, Deck } from '../types/flashcard';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: (cards: Flashcard[], decks: Deck[]) => void;
  cardsCount: number;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
  cardsCount,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [storageStats, setStorageStats] = useState<ClientStorageStats>({
    totalBytes: 0,
    totalMB: '0 MB',
    fileCount: 0,
    freeDisk: '> 50 GB',
    maxFileSize: '50 MB / tệp',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load storage stats when modal opens
  useEffect(() => {
    if (isOpen) {
      api.getStorageStats().then(setStorageStats);
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const json = await exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nihonflash_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setFeedback({ message: 'Đã xuất file sao lưu thành công!', type: 'success' });
    } catch (err) {
      console.error(err);
      setFeedback({ message: 'Không thể xuất dữ liệu sao lưu.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const restored = await importData(text);
      onDataRestored(restored.cards, restored.decks);
      setFeedback({
        message: `Đã khôi phục thành công ${restored.cards.length} thẻ từ file sao lưu!`,
        type: 'success',
      });
      // Refresh storage stats
      api.getStorageStats().then(setStorageStats);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Lỗi khôi phục tệp sao lưu. Vui lòng kiểm tra định dạng JSON.';
      setFeedback({ message, type: 'error' });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetToSample = async () => {
    if (confirm('Khôi phục dữ liệu mẫu ban đầu? Tất cả các tệp media đã tải lên sẽ được xóa sạch khỏi máy chủ và nạp lại bộ thẻ tiếng Nhật chuẩn.')) {
      try {
        const initial = await resetAllData();
        onDataRestored(initial.cards, initial.decks);
        const freshStats = await api.getStorageStats();
        setStorageStats(freshStats);
        setFeedback({ message: 'Đã khôi phục lại dữ liệu mẫu tiếng Nhật ban đầu thành công!', type: 'success' });
      } catch {
        setFeedback({ message: 'Lỗi khôi phục dữ liệu mẫu.', type: 'error' });
      }
    }
  };

  const handleClearAllData = async () => {
    if (confirm('CẢNH BÁO QUAN TRỌNG: Bạn có chắc chắn muốn XOÁ HẲN TOÀN BỘ flashcard và tất cả tệp ảnh, video đã tải lên khỏi máy chủ không?\n\nDung lượng bộ nhớ máy chủ sẽ được giải phóng hoàn toàn về 0 MB.')) {
      try {
        const cleared = await clearAllData();
        onDataRestored(cleared.cards, cleared.decks);
        const freshStats = await api.getStorageStats();
        setStorageStats(freshStats);
        setFeedback({ message: 'Đã xoá sạch hoàn toàn dữ liệu và tệp tải lên khỏi máy chủ!', type: 'success' });
      } catch {
        setFeedback({ message: 'Lỗi khi xoá dữ liệu trên máy chủ.', type: 'error' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-rose-500 fill-rose-500/10" />
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Quản Lý & Sao Lưu Dữ Liệu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3 text-xs rounded-xl flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 1. Top Informational Callout */}
          <div className="rounded-2xl border border-stone-200/90 bg-stone-50/70 p-4 text-xs text-stone-700 leading-relaxed shadow-2xs">
            Dữ liệu flashcard, hình ảnh và video của bạn được <strong className="text-stone-900 font-semibold">lưu trữ trực tiếp trên Máy chủ (Server)</strong>. Các thẻ mới tạo sẽ được lưu vĩnh viễn, truy cập được ở mọi thiết bị và trình duyệt.
          </div>

          {/* 2. DUNG LƯỢNG BỘ NHỚ MÁY CHỦ */}
          <div className="bg-[#1c1917] text-white rounded-2xl p-5 shadow-sm border border-stone-800 space-y-3.5">
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold tracking-wider text-stone-300 uppercase">
                DUNG LƯỢNG BỘ NHỚ MÁY CHỦ
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/60 text-[11px] font-semibold">
                {storageStats.maxFileSize}
              </span>
            </div>

            {/* Middle row: Big size & Free disk */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {storageStats.totalMB}
                </span>
                <span className="text-xs text-stone-400 font-normal">
                  ({storageStats.fileCount} tệp ảnh & video đã tải lên)
                </span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>✓ Ổ đĩa trống {storageStats.freeDisk}</span>
              </div>
            </div>

            {/* Bottom note row */}
            <div className="border-t border-stone-800 pt-3 text-[11px] text-stone-300 flex items-start gap-1.5 leading-relaxed">
              <span className="shrink-0 text-amber-300">💡</span>
              <p>
                Mỗi ảnh học từ vựng (~200KB – 1MB) thì <strong className="text-white font-semibold">1 GB chứa được 2.000 – 10.000 ảnh</strong>. Bạn cũng có thể dùng link ảnh trực tuyến (Unsplash, Imgur) không giới hạn dung lượng!
              </p>
            </div>
          </div>

          {/* 3. Xuất file sao lưu (JSON) */}
          <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-stone-300 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Xuất file sao lưu (JSON)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Tải toàn bộ {cardsCount} thẻ về máy tính
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 active:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang xuất...' : 'Tải về JSON'}</span>
            </button>
          </div>

          {/* 4. Nhập dữ liệu từ file (JSON) */}
          <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-stone-300 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Nhập dữ liệu từ file (JSON)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Phục hồi hoặc gộp thẻ từ file đã lưu
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Đang đọc...' : 'Chọn file JSON'}</span>
            </button>
          </div>

          {/* 5. Khôi phục về mẫu ban đầu */}
          <div className="border border-amber-300/80 rounded-2xl p-4 sm:p-5 bg-amber-50/20 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-400 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Khôi phục về mẫu ban đầu
              </h3>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Xóa các tệp tải lên và nạp lại danh sách từ vựng & media mẫu chuẩn
              </p>
            </div>
            <button
              onClick={handleResetToSample}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200/90 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi phục mẫu</span>
            </button>
          </div>

          {/* 6. Xoá hẳn toàn bộ dữ liệu (Fixes B2) */}
          <div className="border border-red-200 rounded-2xl p-4 sm:p-5 bg-red-50/30 flex items-center justify-between gap-3 shadow-2xs hover:border-red-300 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-500" />
                Xoá hẳn toàn bộ dữ liệu & tệp đã upload
              </h3>
              <p className="text-xs text-red-800/80 mt-0.5">
                Xoá vĩnh viễn tất cả flashcard và giải phóng toàn bộ tệp ảnh/video về 0 MB
              </p>
            </div>
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá toàn bộ</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-stone-100 bg-stone-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-800 font-semibold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
