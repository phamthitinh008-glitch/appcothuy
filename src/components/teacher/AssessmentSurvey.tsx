import React, { useState } from 'react';
import {
  AssessmentRecord,
  StudentProfile,
  TopicKey,
  ErrorClassificationCode
} from '../../types/math';
import { TOPICS, ERROR_CLASSIFICATIONS, ASSESSMENT_SURVEY_A, ASSESSMENT_SURVEY_B } from '../../data/curriculum';
import {
  ClipboardCheck,
  FileText,
  Plus,
  Trash2,
  Calendar,
  User,
  Award,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface AssessmentSurveyProps {
  students: StudentProfile[];
  assessments: AssessmentRecord[];
  onSaveAssessments: (records: AssessmentRecord[]) => void;
}

export const AssessmentSurvey: React.FC<AssessmentSurveyProps> = ({
  students,
  assessments,
  onSaveAssessments
}) => {
  const [selectedStudentCode, setSelectedStudentCode] = useState<string>(students[0]?.code || 'H01');
  const [selectedSkillKey, setSelectedSkillKey] = useState<TopicKey>('A_DEM_SO');
  const [testVersion, setTestVersion] = useState<'A' | 'B'>('A');
  const [correctCount, setCorrectCount] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(5);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [isIndependent, setIsIndependent] = useState<boolean>(true);
  const [teacherNote, setTeacherNote] = useState<string>('');
  const [selectedErrors, setSelectedErrors] = useState<ErrorClassificationCode[]>([]);
  const [previewVersion, setPreviewVersion] = useState<'A' | 'B' | null>(null);

  const handleToggleError = (errCode: ErrorClassificationCode) => {
    if (selectedErrors.includes(errCode)) {
      setSelectedErrors(selectedErrors.filter(e => e !== errCode));
    } else {
      setSelectedErrors([...selectedErrors, errCode]);
    }
  };

  const handleRecordAssessment = () => {
    if (!selectedStudentCode) {
      alert('Vui lòng chọn mã học sinh.');
      return;
    }
    if (correctCount > totalCount) {
      alert('Số câu đúng không được lớn hơn tổng số câu.');
      return;
    }

    const newRecord: AssessmentRecord = {
      id: `as_${Date.now()}`,
      studentCode: selectedStudentCode,
      skillKey: selectedSkillKey,
      date: new Date().toISOString().slice(0, 10),
      testVersion,
      correctCount: Number(correctCount),
      totalCount: Number(totalCount),
      hintsUsed: Number(hintsUsed),
      isIndependent,
      teacherNote: teacherNote.trim(),
      errorTypes: selectedErrors
    };

    onSaveAssessments([newRecord, ...assessments]);
    setTeacherNote('');
    setSelectedErrors([]);
    alert(`Đã ghi nhận kết quả khảo sát Đề ${testVersion} cho học sinh ${selectedStudentCode}.`);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bản ghi khảo sát này?')) {
      onSaveAssessments(assessments.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-800">
              Khảo Sát Năng Lực Đầu Vào & Đánh Giá Định Kỳ (Đề A / Đề B)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hai phiên bản đề tương đương, không trùng câu • Ghi nhận số câu đúng, gợi ý và phân loại lỗi sai
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewVersion('A')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold border border-sky-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem đề khảo sát A</span>
          </button>
          <button
            onClick={() => setPreviewVersion('B')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem đề khảo sát B</span>
          </button>
        </div>
      </div>

      {/* Record Entry Form */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-5">
        <h3 className="font-extrabold text-base text-slate-800">
          Nhập Phiếu Khảo Sát Thực Tế
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Mã học sinh:</label>
            <select
              value={selectedStudentCode}
              onChange={e => setSelectedStudentCode(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.code}>
                  {s.code} {s.notes ? `(${s.notes.slice(0, 15)}...)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Kỹ năng đánh giá:</label>
            <select
              value={selectedSkillKey}
              onChange={e => setSelectedSkillKey(e.target.value as TopicKey)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {TOPICS.map(t => (
                <option key={t.key} value={t.key}>
                  {t.code}: {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Phiên bản đề:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTestVersion('A')}
                className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                  testVersion === 'A'
                    ? 'bg-sky-500 border-sky-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Đề A
              </button>
              <button
                type="button"
                onClick={() => setTestVersion('B')}
                className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                  testVersion === 'B'
                    ? 'bg-teal-500 border-teal-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Đề B
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Phương thức hoàn thành:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsIndependent(true)}
                className={`py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  isIndependent
                    ? 'bg-emerald-500 border-emerald-600 text-white font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Độc lập
              </button>
              <button
                type="button"
                onClick={() => setIsIndependent(false)}
                className={`py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  !isIndependent
                    ? 'bg-amber-500 border-amber-600 text-white font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Có hỗ trợ
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Số câu đúng:</label>
            <input
              type="number"
              min={0}
              max={totalCount}
              value={correctCount}
              onChange={e => setCorrectCount(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Tổng số câu:</label>
            <input
              type="number"
              min={1}
              max={20}
              value={totalCount}
              onChange={e => setTotalCount(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Số lần cần gợi ý:</label>
            <input
              type="number"
              min={0}
              max={10}
              value={hintsUsed}
              onChange={e => setHintsUsed(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-amber-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Điểm đạt (%):</label>
            <div className="px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-800">
              {totalCount > 0 ? `${Math.round((correctCount / totalCount) * 100)}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Error Classifications Multi-Select */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Phân loại lỗi sai quan sát được (chỉ chọn khi có bằng chứng thực tế):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ERROR_CLASSIFICATIONS.map(err => {
              const isSelected = selectedErrors.includes(err.code);
              return (
                <button
                  key={err.code}
                  type="button"
                  onClick={() => handleToggleError(err.code)}
                  className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {err.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">Ghi chú sư phạm của giáo viên:</label>
          <input
            type="text"
            placeholder="Ví dụ: Bé thao tác đếm tốt, cần rèn luyện thêm cách đặt dấu cá sấu..."
            value={teacherNote}
            onChange={e => setTeacherNote(e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          onClick={handleRecordAssessment}
          className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
        >
          Lưu phiếu khảo sát học sinh
        </button>
      </div>

      {/* Assessment History Table */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Lịch Sử Khảo Sát ({assessments.length} bản ghi)
        </h3>

        {assessments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Chưa có kết quả khảo sát nào được lưu. Hãy nhập phiếu ở trên.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Mã HS</th>
                  <th className="py-3 px-3">Kỹ năng</th>
                  <th className="py-3 px-3">Đề</th>
                  <th className="py-3 px-3">Kết quả</th>
                  <th className="py-3 px-3">Tỷ lệ</th>
                  <th className="py-3 px-3">Gợi ý</th>
                  <th className="py-3 px-3">Hình thức</th>
                  <th className="py-3 px-3">Lỗi sai</th>
                  <th className="py-3 px-3">Ghi chú</th>
                  <th className="py-3 px-3 text-right">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.map(rec => {
                  const topic = TOPICS.find(t => t.key === rec.skillKey);
                  const pct = Math.round((rec.correctCount / rec.totalCount) * 100);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-black text-sky-800">{rec.studentCode}</td>
                      <td className="py-3 px-3 font-bold text-slate-700">{topic?.name}</td>
                      <td className="py-3 px-3 font-bold text-slate-500">Đề {rec.testVersion}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-800">
                        {rec.correctCount} / {rec.totalCount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-black px-2 py-0.5 rounded ${
                            pct >= 80 ? 'bg-emerald-100 text-emerald-800' : pct >= 60 ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-600">{rec.hintsUsed} lần</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            rec.isIndependent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {rec.isIndependent ? 'Độc lập' : 'Có hỗ trợ'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {rec.errorTypes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rec.errorTypes.map(err => (
                              <span key={err} className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {ERROR_CLASSIFICATIONS.find(e => e.code === err)?.label || err}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300">Không</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{rec.teacherNote || '---'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteRecord(rec.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Xóa bản ghi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Survey A/B Modal */}
      {previewVersion && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-800">
                Bộ Câu Hỏi Khảo Sát Năng Lực (Đề {previewVersion})
              </h3>
              <button
                onClick={() => setPreviewVersion(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-4">
              {(previewVersion === 'A' ? ASSESSMENT_SURVEY_A : ASSESSMENT_SURVEY_B).map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-sky-800">Câu {idx + 1}: {q.questionText}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-bold">Lựa chọn:</span>
                    {q.options.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className={`px-2.5 py-1 rounded-lg font-black ${
                          String(opt) === String(q.correctAnswer)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <strong>Gợi ý sư phạm:</strong> {q.pedagogicalHint}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
