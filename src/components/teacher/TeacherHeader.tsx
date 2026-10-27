import React, { useRef } from 'react';
import { AppSettings, AppStorage } from '../../utils/storage';
import {
  BookOpen,
  Sparkles,
  Award,
  Upload,
  Download,
  Trash2,
  Gamepad2,
  School,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

interface TeacherHeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onSwitchToStudentMode: () => void;
  onRefreshData: () => void;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
  settings,
  onUpdateSettings,
  onSwitchToStudentMode,
  onRefreshData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    const backupStr = AppStorage.exportFullBackup();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaoLuu_ToanKhoiDauAI_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        const ok = AppStorage.restoreFullBackup(content);
        if (ok) {
          alert('Đã khôi phục dữ liệu thành công!');
          onRefreshData();
        } else {
          alert('Tệp dữ liệu không hợp lệ!');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        const updated = { ...settings, teacherAvatarUrl: dataUrl };
        AppStorage.saveSettings(updated);
        onUpdateSettings(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu thực nghiệm để bắt đầu lớp mới? Hãy xuất bản sao lưu trước nếu cần.')) {
      AppStorage.resetToEmptyRealData();
      onRefreshData();
      alert('Đã xóa trắng dữ liệu. Hệ thống chuyển sang chế độ dữ liệu thực tế sạch.');
    }
  };

  const handleToggleDemo = () => {
    if (!settings.isDemoMode) {
      if (confirm('Chuyển sang Chế độ Demo với dữ liệu mẫu để thử nghiệm giao diện? (Dữ liệu sẽ được dán nhãn Demo rõ ràng).')) {
        AppStorage.seedDemoData();
        onRefreshData();
      }
    } else {
      if (confirm('Tắt chế độ Demo và chuyển về Dữ liệu thực nghiệm?')) {
        AppStorage.resetToEmptyRealData();
        onRefreshData();
      }
    }
  };

  return (
    <header className="bg-white border-b-2 border-sky-100 shadow-sm">
      {/* Top Banner with Author Credentials */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span className="font-extrabold uppercase tracking-wide bg-sky-600/80 px-2 py-0.5 rounded">
              Dự thi AI Giáo dục Việt Nam 2026
            </span>
            <span>•</span>
            <span className="font-medium">
              Tác giả: <strong>{settings.authorName}</strong> – Trường {settings.schoolName} ({settings.location})
            </span>
            <span>•</span>
            <span className="bg-teal-600/80 px-2 py-0.5 rounded font-semibold">
              Lớp {settings.className} ({settings.schoolYear})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {settings.isDemoMode ? (
              <span className="bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 shadow-xs">
                ⚠️ DỮ LIỆU DEMO – KHÔNG PHẢI KẾT QUẢ HỌC SINH
              </span>
            ) : (
              <span className="bg-emerald-500/90 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ✓ Chế độ Dữ liệu Thực nghiệm
              </span>
            )}
            <button
              onClick={handleToggleDemo}
              className="text-xs underline text-sky-200 hover:text-white transition-colors cursor-pointer"
            >
              {settings.isDemoMode ? 'Đổi sang Dữ liệu Thật' : 'Bật Demo xem mẫu'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo: Open Book + Numbers 1 2 3 + Star */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-md border-2 border-white">
            <svg width="40" height="40" viewBox="0 0 64 64">
              {/* Open Book */}
              <path d="M8 44 C18 42, 28 44, 32 48 C36 44, 46 42, 56 44 L56 20 C46 18, 36 20, 32 24 C28 20, 18 18, 8 20 Z" fill="#FFFFFF" />
              <path d="M32 24 L32 48" stroke="#0284C7" strokeWidth="2.5" />
              {/* Numbers 1 2 3 */}
              <text x="16" y="36" fill="#F59E0B" fontSize="12" fontWeight="900" fontFamily="sans-serif">1</text>
              <text x="24" y="32" fill="#10B981" fontSize="11" fontWeight="900" fontFamily="sans-serif">2</text>
              <text x="44" y="34" fill="#EC4899" fontSize="12" fontWeight="900" fontFamily="sans-serif">3</text>
              {/* Shining Star */}
              <polygon points="32,6 35,14 43,15 37,20 39,28 32,24 25,28 27,20 21,15 29,14" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-sky-900 tracking-tight">
                {settings.appLogoText}
              </h1>
              <span className="text-xs bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-md border border-sky-200">
                TRUNG TÂM GIÁO VIÊN AI
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-teal-700 tracking-wide">
              Chạm số – Hiểu nhanh – Học vui • GDPT 2018
            </p>
          </div>
        </div>

        {/* Teacher Avatar & Quick Controls */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Teacher portrait upload container */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              {settings.teacherAvatarUrl ? (
                <img
                  src={settings.teacherAvatarUrl}
                  alt="Ảnh giáo viên"
                  className="w-10 h-10 rounded-full object-cover border-2 border-sky-500 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm border border-sky-300">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-3.5 h-3.5 text-white" />
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-slate-800">{settings.authorName}</div>
              <div className="text-[11px] text-slate-500">GV Lớp {settings.className}</div>
            </div>
          </div>

          {/* Backup & Data Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportBackup}
              className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors border border-slate-200"
              title="Xuất bản sao lưu dữ liệu (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors border border-slate-200"
              title="Khôi phục dữ liệu từ tệp sao lưu"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />
            <button
              onClick={handleResetData}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
              title="Xóa trắng dữ liệu thực nghiệm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Launch Student Mode Button */}
          <button
            onClick={onSwitchToStudentMode}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all text-xs md:text-sm cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>MỞ GÓC TOÁN VUI (HỌC SINH)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
