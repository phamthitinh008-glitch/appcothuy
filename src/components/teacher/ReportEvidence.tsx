import React from 'react';
import {
  StudentProfile,
  AssessmentRecord,
  StudentGameSessionResult,
  AssignedTask
} from '../../types/math';
import { TOPICS } from '../../data/curriculum';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ReportEvidenceProps {
  students: StudentProfile[];
  assessments: AssessmentRecord[];
  sessionResults: StudentGameSessionResult[];
  assignedTasks: AssignedTask[];
  isDemoMode: boolean;
  schoolName: string;
  authorName: string;
  className: string;
}

export const ReportEvidence: React.FC<ReportEvidenceProps> = ({
  students,
  assessments,
  sessionResults,
  assignedTasks,
  isDemoMode,
  schoolName,
  authorName,
  className
}) => {
  // Pre (Version A) vs Post (Version B) rigorous statistical analysis
  const preAssessments = assessments.filter(a => a.testVersion === 'A');
  const postAssessments = assessments.filter(a => a.testVersion === 'B');

  // Find students who have both A and B
  const studentsWithBoth: string[] = [];
  students.forEach(st => {
    const hasA = preAssessments.some(a => a.studentCode === st.code);
    const hasB = postAssessments.some(a => a.studentCode === st.code);
    if (hasA && hasB) studentsWithBoth.push(st.code);
  });

  // Calculate pre average
  const preScores = studentsWithBoth.map(code => {
    const recs = preAssessments.filter(a => a.studentCode === code);
    const tot = recs.reduce((acc, r) => acc + r.totalCount, 0);
    const cor = recs.reduce((acc, r) => acc + r.correctCount, 0);
    return tot > 0 ? (cor / tot) * 100 : 0;
  });
  const avgPre = preScores.length > 0 ? Number((preScores.reduce((a, b) => a + b, 0) / preScores.length).toFixed(1)) : 0;

  // Calculate post average
  const postScores = studentsWithBoth.map(code => {
    const recs = postAssessments.filter(a => a.studentCode === code);
    const tot = recs.reduce((acc, r) => acc + r.totalCount, 0);
    const cor = recs.reduce((acc, r) => acc + r.correctCount, 0);
    return tot > 0 ? (cor / tot) * 100 : 0;
  });
  const avgPost = postScores.length > 0 ? Number((postScores.reduce((a, b) => a + b, 0) / postScores.length).toFixed(1)) : 0;

  const scoreDiff = Number((avgPost - avgPre).toFixed(1));

  // Count progress
  let countImproved = 0;
  let countUnchanged = 0;
  let countDecreased = 0;

  studentsWithBoth.forEach((_, idx) => {
    const diff = postScores[idx] - preScores[idx];
    if (diff > 0) countImproved++;
    else if (diff === 0) countUnchanged++;
    else countDecreased++;
  });

  // Hints usage stats
  const totalHints = assessments.reduce((acc, r) => acc + r.hintsUsed, 0);
  const avgHintsPerAssessment = assessments.length > 0 ? Number((totalHints / assessments.length).toFixed(1)) : 0;

  // Estimated preparation time saved (traditionally 45 mins per interactive paper worksheet vs 5 mins with AI)
  const timeSavedMinutes = sessionResults.length * 40;
  const timeSavedHours = (timeSavedMinutes / 60).toFixed(1);

  const handleExportCsv = () => {
    const headers = ['Mã học sinh', 'Điểm trước (Đề A %)', 'Điểm sau (Đề B %)', 'Mức chênh lệch (%)', 'Đánh giá'];
    const rows = studentsWithBoth.map((code, idx) => {
      const diff = Number((postScores[idx] - preScores[idx]).toFixed(1));
      const status = diff > 0 ? 'Tiến bộ' : diff === 0 ? 'Không đổi' : 'Cần hỗ trợ';
      return [code, `${preScores[idx]}%`, `${postScores[idx]}%`, `${diff}%`, status];
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCao_ThucNghiem_1A3_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const data = {
      title: 'Báo cáo khoa học thực nghiệm dự án Toán Khởi Đầu AI',
      author: authorName,
      school: schoolName,
      className,
      exportedAt: new Date().toISOString(),
      isDemoMode,
      metrics: {
        totalStudentsParticipated: students.length,
        studentsWithPairedData: studentsWithBoth.length,
        averagePreTest: avgPre,
        averagePostTest: avgPost,
        difference: scoreDiff,
        improvedCount: countImproved,
        unchangedCount: countUnchanged,
        decreasedCount: countDecreased,
        avgHintsPerAssessment,
        timeSavedMinutes
      },
      detailedStudents: studentsWithBoth.map((code, idx) => ({
        studentCode: code,
        preScore: preScores[idx],
        postScore: postScores[idx],
        diff: postScores[idx] - preScores[idx]
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCao_MinhChung_${className}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-800">
              Báo Cáo Thực Nghiệm Sư Phạm & Minh Chứng Khoa Học
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Số liệu thống kê thực chứng từ lớp {className} ({schoolName}) • Tuyệt đối không bịa đặt số liệu
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất JSON</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu PDF</span>
          </button>
        </div>
      </div>

      {isDemoMode && (
        <div className="bg-amber-100 border-2 border-amber-300 text-amber-950 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            CHÚ Ý: Đang hiển thị số liệu từ chế độ Demo. Khi nộp hồ sơ dự thi AI Giáo dục Việt Nam 2026, vui lòng tắt chế độ Demo và nhập kết quả thực tế của lớp 1A3.
          </span>
        </div>
      )}

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Học sinh khảo sát Đề A & B</div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {studentsWithBoth.length} <span className="text-sm font-normal text-slate-400">/ {students.length} HS</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Đủ dữ liệu đối sánh trước - sau</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Điểm TB Trước ➔ Sau</div>
          <div className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-1.5">
            <span>{avgPre}%</span>
            <span className="text-slate-400">➔</span>
            <span className="text-emerald-600">{avgPost}%</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">
            {scoreDiff >= 0 ? `Tăng +${scoreDiff}%` : `Chênh lệch ${scoreDiff}%`}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Phân loại tiến bộ</div>
          <div className="text-sm font-black text-slate-900 mt-2 space-y-0.5">
            <div className="text-emerald-700">Tiến bộ: {countImproved} HS</div>
            <div className="text-slate-600">Không đổi: {countUnchanged} HS</div>
            <div className="text-rose-600">Giảm: {countDecreased} HS</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Thời gian GV tiết kiệm</div>
          <div className="text-3xl font-black text-sky-700 mt-2">
            ~{timeSavedHours} <span className="text-sm font-normal text-slate-400">giờ</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">So với soạn thủ công</div>
        </div>
      </div>

      {/* Visual Charts Comparison: Pre vs Post Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Biểu Đồ So Sánh Kết Quả Trước và Sau Can Thiệp Sư Phạm (Pre-test vs Post-test)
        </h3>

        {studentsWithBoth.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có học sinh nào hoàn thành cả hai phiên bản Đề A và Đề B.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {studentsWithBoth.map((code, idx) => {
              const pre = preScores[idx];
              const post = postScores[idx];

              return (
                <div key={code} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{code}</span>
                    <span className="text-slate-500">
                      Trước: {pre}% | Sau: {post}% ({post >= pre ? `+${(post - pre).toFixed(1)}%` : `${(post - pre).toFixed(1)}%`})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Pre Bar */}
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full" style={{ width: `${pre}%` }} />
                    </div>
                    {/* Post Bar */}
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${post}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Bảng Dữ Liệu Đối Sánh Chi Tiết Từng Học Sinh
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Mã học sinh</th>
                <th className="py-3 px-3">Điểm Đề A (Trước)</th>
                <th className="py-3 px-3">Điểm Đề B (Sau)</th>
                <th className="py-3 px-3">Chênh lệch</th>
                <th className="py-3 px-3">Đánh giá tiến bộ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsWithBoth.map((code, idx) => {
                const pre = preScores[idx];
                const post = postScores[idx];
                const diff = Number((post - pre).toFixed(1));

                return (
                  <tr key={code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-black text-sky-800">{code}</td>
                    <td className="py-3 px-3 font-bold text-slate-600">{pre}%</td>
                    <td className="py-3 px-3 font-black text-emerald-700">{post}%</td>
                    <td className="py-3 px-3 font-extrabold text-slate-800">
                      {diff >= 0 ? `+${diff}%` : `${diff}%`}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-black ${
                          diff > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : diff === 0
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {diff > 0 ? '✓ Tiến bộ' : diff === 0 ? 'Không đổi' : 'Cần hỗ trợ thêm'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
