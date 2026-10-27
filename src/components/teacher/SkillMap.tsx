import React, { useState } from 'react';
import { StudentProfile, AssessmentRecord, TopicKey, MasteryLevel } from '../../types/math';
import { TOPICS } from '../../data/curriculum';
import { AppStorage, AppSettings } from '../../utils/storage';
import {
  Map,
  Sliders,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Info
} from 'lucide-react';

interface SkillMapProps {
  students: StudentProfile[];
  assessments: AssessmentRecord[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SkillMap: React.FC<SkillMapProps> = ({
  students,
  assessments,
  settings,
  onUpdateSettings
}) => {
  const [selectedStudentCode, setSelectedStudentCode] = useState<string>(students[0]?.code || 'H01');
  const [mamXanhCutoff, setMamXanhCutoff] = useState<number>(settings.mamXanhThreshold || 60);
  const [vuonCaoCutoff, setVuonCaoCutoff] = useState<number>(settings.vuonCaoThreshold || 80);

  const handleSaveThresholds = () => {
    const updated = {
      ...settings,
      mamXanhThreshold: mamXanhCutoff,
      vuonCaoThreshold: vuonCaoCutoff
    };
    AppStorage.saveSettings(updated);
    onUpdateSettings(updated);
    alert('Đã cập nhật ngưỡng năng lực thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Header and Pedagogical Principles Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-800">
              Bản Đồ Năng Lực & Vùng Phát Triển Toán Học
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mầm Xanh (củng cố) • Vươn Cao (luyện tập) • Tỏa Sáng (thử thách) • Giáo viên có toàn quyền quyết định sư phạm
          </p>
        </div>

        {/* 3 Level Legend */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
            <span>🌱 Mầm Xanh</span>
            <span className="text-[10px] text-amber-600">(&lt;{settings.mamXanhThreshold}%)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 rounded-xl text-xs font-bold text-sky-900">
            <span>🌿 Vươn Cao</span>
            <span className="text-[10px] text-sky-600">({settings.mamXanhThreshold}% - &lt;{settings.vuonCaoThreshold}%)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
            <span>⭐ Tỏa Sáng</span>
            <span className="text-[10px] text-emerald-600">(&ge;{settings.vuonCaoThreshold}% × 2 lần)</span>
          </div>
        </div>
      </div>

      {/* Threshold Tuner */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Điều Chỉnh Ngưỡng Đánh Giá Năng Lực Theo Yêu Cầu Lớp 1A3
            </h3>
          </div>
          <button
            onClick={handleSaveThresholds}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Lưu ngưỡng mới
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-amber-800">Ngưỡng Mầm Xanh: Dưới {mamXanhCutoff}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={70}
              value={mamXanhCutoff}
              onChange={e => setMamXanhCutoff(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-800">Ngưỡng Tỏa Sáng: Từ {vuonCaoCutoff}% trở lên</span>
            </div>
            <input
              type="range"
              min={70}
              max={95}
              value={vuonCaoCutoff}
              onChange={e => setVuonCaoCutoff(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Student Selector and Grid of Skills */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Xem bản đồ năng lực của học sinh:</span>
            <select
              value={selectedStudentCode}
              onChange={e => setSelectedStudentCode(e.target.value)}
              className="px-3 py-1.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-sky-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.code}>
                  Học sinh {s.code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <span>Không gắn nhãn học sinh cố định • Tôn trọng tiến trình phát triển tự nhiên của trẻ</span>
          </div>
        </div>

        {/* 10 Skills Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {TOPICS.map(topic => {
            const mastery = AppStorage.calculateStudentSkillMastery(selectedStudentCode, topic.key);

            let badgeBg = 'bg-slate-100 text-slate-500 border-slate-200';
            let badgeText = 'Chưa đủ dữ liệu';
            let icon = '⚪';

            if (mastery.level === 'MAM_XANH') {
              badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
              badgeText = 'Mầm Xanh (Cần hỗ trợ)';
              icon = '🌱';
            } else if (mastery.level === 'VUON_CAO') {
              badgeBg = 'bg-sky-100 text-sky-900 border-sky-300';
              badgeText = 'Vươn Cao (Đang luyện tập)';
              icon = '🌿';
            } else if (mastery.level === 'TOA_SANG') {
              badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300';
              badgeText = 'Tỏa Sáng (Vững chắc)';
              icon = '⭐';
            }

            return (
              <div
                key={topic.key}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase text-sky-700">
                      {topic.code}
                    </span>
                    <span className="text-base">{icon}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-800 line-clamp-2">
                    {topic.name}
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black border text-center ${badgeBg}`}>
                    {badgeText}
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                    <div className="flex justify-between">
                      <span>Điểm đạt:</span>
                      <strong className="text-slate-700">{mastery.scorePercent}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Số bài khảo sát:</span>
                      <strong className="text-slate-700">{mastery.testsCount} bài</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Gợi ý trung bình:</span>
                      <strong className="text-slate-700">{mastery.avgHints} lần</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
