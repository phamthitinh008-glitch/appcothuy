import React from 'react';
import {
  StudentProfile,
  AssessmentRecord,
  GameDefinition,
  StudentGameSessionResult,
  AssignedTask
} from '../../types/math';
import { TOPICS } from '../../data/curriculum';
import {
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  AlertTriangle,
  FileText,
  PlusCircle,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface DashboardOverviewProps {
  students: StudentProfile[];
  assessments: AssessmentRecord[];
  games: GameDefinition[];
  sessionResults: StudentGameSessionResult[];
  assignedTasks: AssignedTask[];
  onNavigate: (tab: string) => void;
  isDemoMode: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  assessments,
  games,
  sessionResults,
  assignedTasks,
  onNavigate,
  isDemoMode
}) => {
  const realStudentsCount = students.length;
  const uniqueSkillsAssessed = new Set(assessments.map(a => a.skillKey)).size;
  const gamesCreatedCount = games.length;
  const gamesApprovedCount = games.filter(g => g.approvalStatus === 'APPROVED' || g.isDemo).length;
  const realSessionsCount = sessionResults.length;

  const completedTasks = assignedTasks.filter(t => t.status === 'DA_NHAN_KET_QUA').length;
  const taskCompletionRate = assignedTasks.length > 0 ? Math.round((completedTasks / assignedTasks.length) * 100) : 0;

  // Identify skills needing reinforcement (Mam Xanh)
  const skillsNeedingSupportMap: { [key: string]: number } = {};
  assessments.forEach(rec => {
    if (rec.correctCount / rec.totalCount < 0.6 || !rec.isIndependent) {
      skillsNeedingSupportMap[rec.skillKey] = (skillsNeedingSupportMap[rec.skillKey] || 0) + 1;
    }
  });

  const skillsNeedingSupport = Object.entries(skillsNeedingSupportMap).map(([key, count]) => {
    const topic = TOPICS.find(t => t.key === key);
    return {
      key,
      name: topic?.name || key,
      count
    };
  });

  const hasRealData = realStudentsCount > 0 || assessments.length > 0 || sessionResults.length > 0;

  return (
    <div className="space-y-6">
      {/* Demo Warning Banner if active */}
      {isDemoMode && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm">Đang ở chế độ xem thử (Dữ liệu Demo)</h4>
              <p className="text-xs text-amber-800">
                Dữ liệu hiển thị mang tính minh họa giao diện, không phải kết quả thực tế của lớp 1A3.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('class')}
            className="text-xs font-bold bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors"
          >
            Nhập học sinh thật
          </button>
        </div>
      )}

      {/* Quick Action Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
          Hành động nhanh:
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('assessment')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Bắt đầu khảo sát A/B</span>
          </button>
          <button
            onClick={() => onNavigate('workshop')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo trò chơi AI</span>
          </button>
          <button
            onClick={() => onNavigate('class')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Quản lý lớp 1A3</span>
          </button>
          <button
            onClick={() => onNavigate('skillmap')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Xem bản đồ năng lực</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-xs font-bold text-slate-500">Học sinh 1A3</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {realStudentsCount > 0 ? realStudentsCount : '0'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sĩ số thực tế</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-bold text-slate-500">Kỹ năng khảo sát</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {uniqueSkillsAssessed} / 10
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Chuẩn GDPT 2018</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-500">Trò chơi đã tạo</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {gamesCreatedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Trong kho học liệu</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-xs font-bold text-slate-500">Trò chơi đã duyệt</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-teal-700">
            {gamesApprovedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sẵn sàng giao học sinh</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-500">Lượt học thực tế</span>
            <PlayCircle className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {realSessionsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Bài nộp từ học sinh</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold text-slate-500">Hoàn thành bài</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {assignedTasks.length > 0 ? `${taskCompletionRate}%` : '---'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tiến độ giao nhiệm vụ</div>
        </div>
      </div>

      {/* Main Analysis: Skills needing support + Progress Chart */}
      {!hasRealData && !isDemoMode ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-700 mb-1">Chưa có dữ liệu thực nghiệm</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            Thầy cô vui lòng bắt đầu bằng cách thêm danh sách mã học sinh lớp 1A3 hoặc thực hiện khảo sát năng lực đầu vào.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('class')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Nhập mã học sinh lớp 1A3
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Khảo sát đề A/B
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Real Progress by Skill */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-800">
                  Biểu Đồ Tiến Độ Theo Kỹ Năng Toán 1
                </h3>
                <p className="text-xs text-slate-500">
                  Tỷ lệ học sinh đạt yêu cầu trên các kỹ năng chuẩn GDPT 2018
                </p>
              </div>
              <span className="text-xs bg-sky-50 text-sky-700 font-bold px-2.5 py-1 rounded-lg border border-sky-200">
                {assessments.length} lượt khảo sát
              </span>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="space-y-3 pt-2">
              {TOPICS.slice(0, 6).map(topic => {
                const topicRecords = assessments.filter(a => a.skillKey === topic.key);
                const total = topicRecords.reduce((acc, r) => acc + r.totalCount, 0);
                const correct = topicRecords.reduce((acc, r) => acc + r.correctCount, 0);
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

                let barColor = 'bg-slate-200';
                if (total > 0) {
                  barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-sky-500' : 'bg-amber-400';
                }

                return (
                  <div key={topic.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">{topic.name}</span>
                      <span className="font-extrabold text-slate-600">
                        {total > 0 ? `${pct}% (${topicRecords.length} lượt)` : 'Chưa khảo sát'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${total > 0 ? pct : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Skills Needing Reinforcement */}
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-800">
                  Kỹ Năng Cần Củng Cố
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Các nội dung có học sinh cần hỗ trợ (Mầm Xanh / cần gợi ý)
              </p>

              <div className="mt-4 space-y-2.5">
                {skillsNeedingSupport.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                    <div className="text-xs font-bold text-emerald-800">
                      Chưa ghi nhận kỹ năng nào rơi vào mức Mầm Xanh
                    </div>
                  </div>
                ) : (
                  skillsNeedingSupport.map(sk => (
                    <div
                      key={sk.key}
                      className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-amber-950">{sk.name}</span>
                      <span className="bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded-lg">
                        {sk.count} lượt cần hỗ trợ
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('errors')}
              className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
            >
              Phân tích lỗi sai & Giao bài củng cố
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
