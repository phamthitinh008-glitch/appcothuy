import React, { useState } from 'react';
import {
  AssessmentRecord,
  StudentGameSessionResult,
  StudentProfile,
  ErrorClassificationCode
} from '../../types/math';
import { ERROR_CLASSIFICATIONS, TOPICS } from '../../data/curriculum';
import {
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileQuestion,
  TrendingDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ErrorAnalysisProps {
  assessments: AssessmentRecord[];
  sessionResults: StudentGameSessionResult[];
  students: StudentProfile[];
  onAssignRemedialTask: (taskName: string, studentCode: string, skillKey: string) => void;
}

export const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({
  assessments,
  sessionResults,
  students,
  onAssignRemedialTask
}) => {
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('all');

  // Aggregate errors across assessments
  const errorStatsMap: { [key: string]: { count: number; studentCodes: Set<string> } } = {};
  ERROR_CLASSIFICATIONS.forEach(e => {
    errorStatsMap[e.code] = { count: 0, studentCodes: new Set() };
  });

  assessments.forEach(rec => {
    rec.errorTypes.forEach(err => {
      if (errorStatsMap[err]) {
        errorStatsMap[err].count += 1;
        errorStatsMap[err].studentCodes.add(rec.studentCode);
      }
    });
  });

  // Also inspect student game session results: if attemptsCount > totalQuestions * 1.5 or hintsCount >= 2, record rule-based observation
  sessionResults.forEach(res => {
    if (res.hintsCount >= 2) {
      errorStatsMap['can_nhieu_goi_y'].count += 1;
      errorStatsMap['can_nhieu_goi_y'].studentCodes.add(res.studentCode);
    }
  });

  const totalErrorsRecorded = Object.values(errorStatsMap).reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-black text-slate-800">
              Phân Tích Lỗi Sai & Giải Pháp Sư Phạm Thích Ứng
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Phân loại lỗi dựa trên quy tắc toán học khách quan • Tuyệt đối không suy diễn tâm lý hoặc y tế • Đề xuất nhiệm vụ củng cố
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-50 text-amber-900 font-extrabold px-3 py-1.5 rounded-xl border border-amber-200">
            {totalErrorsRecorded} trường hợp cần hỗ trợ
          </span>
        </div>
      </div>

      {/* 8 Rule-based Error Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ERROR_CLASSIFICATIONS.map(errDef => {
          const stats = errorStatsMap[errDef.code];
          const hasIssues = stats && stats.count > 0;

          return (
            <div
              key={errDef.code}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                hasIssues
                  ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{hasIssues ? '⚠️' : '✓'}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      hasIssues ? 'bg-amber-200 text-amber-950 font-black' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {stats ? `${stats.count} lượt` : '0 lượt'}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-800">{errDef.label}</h3>
                <div className="mt-2 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Biện pháp:</strong> {errDef.pedagogicalAction}</span>
                  </div>
                </div>
              </div>

              {/* Impacted Students & Quick Assign */}
              {hasIssues && (
                <div className="pt-2 border-t border-amber-200/60 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    Học sinh ghi nhận ({stats.studentCodes.size}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(stats.studentCodes).map(code => (
                      <span
                        key={code}
                        className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-black"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const firstStudent = Array.from(stats.studentCodes)[0];
                      onAssignRemedialTask(
                        `Bài củng cố: ${errDef.label}`,
                        firstStudent,
                        'A_DEM_SO'
                      );
                    }}
                    className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Giao nhiệm vụ củng cố
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
