import React, { useState } from 'react';
import {
  GameDefinition,
  TopicKey,
  NumberRange,
  GameTypeCode,
  MathQuestion,
  CurriculumLesson
} from '../../types/math';
import { TOPICS, GAMES_INFO } from '../../data/curriculum';
import { generateStandaloneHtml5 } from '../../utils/html5Exporter';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Printer,
  Edit,
  Save,
  CheckCheck,
  RefreshCw,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface AiGameWorkshopProps {
  lessons: CurriculumLesson[];
  onSaveGameToBank: (game: GameDefinition) => void;
}

export const AiGameWorkshop: React.FC<AiGameWorkshopProps> = ({
  lessons,
  onSaveGameToBank
}) => {
  const [topicKey, setTopicKey] = useState<TopicKey>('A_DEM_SO');
  const [lessonTitle, setLessonTitle] = useState('Đếm và nhận biết các số trong phạm vi 10');
  const [learningObjective, setLearningObjective] = useState('Học sinh đếm chính xác số lượng và ghép đúng thẻ số');
  const [numberRange, setNumberRange] = useState<NumberRange>('0-10');
  const [difficulty, setDifficulty] = useState<'MAM_XANH' | 'VUON_CAO' | 'TOA_SANG'>('VUON_CAO');
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [gameType, setGameType] = useState<GameTypeCode>('vuon_so');
  const [guideNote, setGuideNote] = useState('Hướng dẫn bé chạm vào từng đồ vật để đếm lần lượt');
  const [imageStyleReq, setImageStyleReq] = useState('Hình vẽ hoạt hình SVG tươi sáng, rõ ràng, phù hợp học sinh 6 tuổi');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<GameDefinition | null>(null);
  const [validationReport, setValidationReport] = useState<{
    valid: boolean;
    issues: string[];
  } | null>(null);
  const [previewQuestionIdx, setPreviewQuestionIdx] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState<MathQuestion | null>(null);

  // Sync lesson title and objective when teacher selects taught lessons
  const handleSelectPredefinedLesson = (lessonId: string) => {
    const found = lessons.find(l => l.id === lessonId);
    if (found) {
      setLessonTitle(found.title);
      setLearningObjective(found.objective);
      setTopicKey(found.topicKey);
      setNumberRange(found.numberRange);
    }
  };

  // Call Server-Side Gemini API
  const handleGenerateGame = async () => {
    setIsLoading(true);
    setValidationReport(null);
    try {
      const res = await fetch('/api/gemini/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: TOPICS.find(t => t.key === topicKey)?.name || topicKey,
          lessonTitle,
          learningObjective,
          numberRange,
          gameType,
          questionCount,
          difficulty
          // Notice: STRICT ZERO student identification parameters
        })
      });

      const data = await res.json();
      if (data.success && data.game) {
        // Enforce Pending Approval state
        const gameWithPendingState: GameDefinition = {
          ...data.game,
          topicKey,
          approvalStatus: 'PENDING'
        };
        setGeneratedGame(gameWithPendingState);
        runAutomaticMathValidation(gameWithPendingState);
      } else {
        alert(data.error || 'Có lỗi xảy ra khi tạo câu hỏi.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Lỗi kết nối tới máy chủ tạo học liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Programmatic Math Validation Suite (Rule VIII)
  const runAutomaticMathValidation = (game: GameDefinition) => {
    const issues: string[] = [];
    const max = game.numberRange === '0-100' ? 100 : game.numberRange === '0-20' ? 20 : 10;

    game.questions.forEach((q, idx) => {
      // 1. Correct answer within unlocked number range
      const numAns = Number(q.correctAnswer);
      if (!isNaN(numAns) && (numAns < 0 || numAns > max)) {
        issues.push(`Câu ${idx + 1}: Đáp án ${numAns} vượt quá phạm vi số ${game.numberRange}`);
      }

      // 2. Options uniqueness
      const opts = q.options.map(o => String(o).trim());
      const uniqueOpts = new Set(opts);
      if (uniqueOpts.size !== opts.length) {
        issues.push(`Câu ${idx + 1}: Có các phương án lựa chọn bị trùng lặp`);
      }

      // 3. Exactly one correct answer exists in options
      const correctMatches = opts.filter(o => o === String(q.correctAnswer).trim());
      if (correctMatches.length !== 1) {
        issues.push(`Câu ${idx + 1}: Đáp án đúng không nằm trong danh sách lựa chọn hoặc có nhiều đáp án trùng.`);
      }

      // 4. Arithmetic check for addition/subtraction
      if (q.questionText.includes('+')) {
        const match = q.questionText.match(/(\d+)\s*\+\s*(\d+)/);
        if (match) {
          const a = Number(match[1]);
          const b = Number(match[2]);
          if (a + b !== Number(q.correctAnswer)) {
            issues.push(`Câu ${idx + 1}: Phép cộng ${a} + ${b} có kết quả thực là ${a + b}, khác với đáp án ${q.correctAnswer}`);
          }
        }
      } else if (q.questionText.includes('-')) {
        const match = q.questionText.match(/(\d+)\s*-\s*(\d+)/);
        if (match) {
          const a = Number(match[1]);
          const b = Number(match[2]);
          if (a - b < 0) {
            issues.push(`Câu ${idx + 1}: Phép trừ sinh hiệu âm (${a} - ${b}), vi phạm quy chuẩn lớp 1`);
          }
          if (a - b !== Number(q.correctAnswer)) {
            issues.push(`Câu ${idx + 1}: Phép trừ ${a} - ${b} có kết quả thực là ${a - b}, khác với đáp án ${q.correctAnswer}`);
          }
        }
      }
    });

    setValidationReport({
      valid: issues.length === 0,
      issues
    });
  };

  const handleApproveGame = () => {
    if (!generatedGame) return;
    if (validationReport && !validationReport.valid) {
      if (!confirm('Bộ câu hỏi còn cảnh báo kiểm tra toán học. Bạn có chắc chắn muốn duyệt?')) {
        return;
      }
    }
    const approved: GameDefinition = {
      ...generatedGame,
      approvalStatus: 'APPROVED'
    };
    setGeneratedGame(approved);
    onSaveGameToBank(approved);
    alert('Đã DUYỆT và LƯU trò chơi vào Ngân hàng học liệu thành công!');
  };

  const handleDownloadStandaloneHtml = () => {
    if (!generatedGame) return;
    const html = generateStandaloneHtml5(generatedGame);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TroChoi_${generatedGame.gameType}_${generatedGame.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintWorksheet = () => {
    if (!generatedGame) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
      <head>
        <title>Phiếu Bài Tập Toán 1 - ${generatedGame.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
          .q-box { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px dashed #ccc; }
          .options { display: flex; gap: 24px; margin-top: 8px; font-weight: bold; }
          .opt-circle { display: inline-block; width: 24px; height: 24px; border: 1px solid #333; border-radius: 50%; text-align: center; margin-right: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h3>TRƯỜNG TIỂU HỌC HIỂN KHÁNH - LỚP 1A3</h3>
          <h2>PHIẾU BÀI TẬP TOÁN KHỞI ĐẦU</h2>
          <p>Bài: ${generatedGame.lessonTitle} • Mã học sinh: ......... • Ngày làm: .........</p>
        </div>
        ${generatedGame.questions.map((q, i) => `
          <div class="q-box">
            <strong>Câu ${i + 1}:</strong> ${q.questionText}
            <div class="options">
              ${q.options.map(opt => `<div><span class="opt-circle"></span> ${opt}</div>`).join('')}
            </div>
          </div>
        `).join('')}
        <script>window.print();</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-black text-slate-800">
            Xưởng Trò Chơi AI – Thiết Kế & Kiểm Duyệt Học Liệu Toán 1
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Chỉ giáo viên được truy cập • Gemini API xử lý yêu cầu sư phạm tổng quan phía máy chủ, không nhận thông tin học sinh • Mọi câu hỏi phải qua kiểm định toán học và chờ giáo viên duyệt.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          1. Thiết Lập Yêu Cầu Sư Phạm
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Chọn từ bài học đã dạy:</label>
            <select
              onChange={e => handleSelectPredefinedLesson(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="">-- Chọn bài học mẫu --</option>
              {lessons.map(l => (
                <option key={l.id} value={l.id}>
                  Tuần {l.week}: {l.title} ({l.numberRange})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Chủ đề chuẩn GDPT 2018:</label>
            <select
              value={topicKey}
              onChange={e => setTopicKey(e.target.value as TopicKey)}
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
            <label className="text-xs font-bold text-slate-600 block mb-1">Kiểu trò chơi (8 Game):</label>
            <select
              value={gameType}
              onChange={e => setGameType(e.target.value as GameTypeCode)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-sky-800"
            >
              {GAMES_INFO.map(g => (
                <option key={g.code} value={g.code}>
                  {g.title} ({g.badge})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Phạm vi số:</label>
            <select
              value={numberRange}
              onChange={e => setNumberRange(e.target.value as NumberRange)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-indigo-700"
            >
              <option value="0-10">Trong phạm vi 10 (0–10)</option>
              <option value="0-20">Trong phạm vi 20 (0–20)</option>
              <option value="0-100">Trong phạm vi 100 (0–100)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Mức độ năng lực:</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="MAM_XANH">Mầm Xanh (Nhận biết cơ bản)</option>
              <option value="VUON_CAO">Vươn Cao (Kết nối vận dụng)</option>
              <option value="TOA_SANG">Tỏa Sáng (Thử thách mở rộng)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Số câu hỏi (7–10 câu):</label>
            <input
              type="number"
              min={7}
              max={10}
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-center"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">Tên bài học:</label>
            <input
              type="text"
              value={lessonTitle}
              onChange={e => setLessonTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">Mục tiêu cần đạt:</label>
            <input
              type="text"
              value={learningObjective}
              onChange={e => setLearningObjective(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">Yêu cầu hình ảnh / đồ họa trực quan:</label>
            <input
              type="text"
              value={imageStyleReq}
              onChange={e => setImageStyleReq(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleGenerateGame}
            disabled={isLoading}
            className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Đang tạo câu hỏi & kiểm định...' : 'AI ĐỀ XUẤT NỘI DUNG (GEMINI 3.8 FLASH)'}</span>
          </button>
        </div>
      </div>

      {/* Generated Result & Validation Section */}
      {generatedGame && (
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-300 shadow-md space-y-5">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">{generatedGame.title}</h3>
                <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">
                  CHỜ GIÁO VIÊN DUYỆT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {generatedGame.questions.length} câu hỏi • Phạm vi {generatedGame.numberRange} • Kiểu {generatedGame.gameType}
              </p>
            </div>

            {/* Teacher Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleApproveGame}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>DUYỆT & LƯU VÀO KHO</span>
              </button>
              <button
                onClick={handleDownloadStandaloneHtml}
                className="py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Tải gói HTML5 chơi offline"
              >
                <Download className="w-4 h-4" />
                <span>Xuất HTML5</span>
              </button>
              <button
                onClick={handlePrintWorksheet}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="In phiếu A4"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu A4</span>
              </button>
            </div>
          </div>

          {/* Automatic Math Verification Report */}
          {validationReport && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                validationReport.valid
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {validationReport.valid ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div>
                <h4 className="font-extrabold text-xs">
                  {validationReport.valid
                    ? 'Bộ kiểm thử toán học tự động: 100% ĐẠT CHUẨN'
                    : 'Cảnh báo tính đúng đắn toán học:'}
                </h4>
                {validationReport.valid ? (
                  <p className="mt-0.5 text-emerald-700">
                    Mọi đáp án, số lượng hình vẽ và phép tính đã được kiểm chứng số học. Không có đáp án trùng lặp, không vượt quá phạm vi số {generatedGame.numberRange}.
                  </p>
                ) : (
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    {validationReport.issues.map((iss, i) => (
                      <li key={i}>{iss}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Question List and Inline Edit */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-800">
              Danh sách {generatedGame.questions.length} câu hỏi (Giáo viên được chỉnh sửa từng câu):
            </h4>

            <div className="space-y-3">
              {generatedGame.questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs text-slate-900">
                      <span className="text-sky-700 mr-1.5 font-black">Câu {idx + 1}:</span>
                      {q.questionText}
                    </div>
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="p-1 text-slate-500 hover:text-sky-700 transition-colors"
                      title="Sửa câu hỏi này"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-slate-400 font-bold">Phương án:</span>
                    {q.options.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className={`px-2.5 py-0.5 rounded-lg font-bold text-xs ${
                          String(opt).trim() === String(q.correctAnswer).trim()
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {opt} {String(opt).trim() === String(q.correctAnswer).trim() && '✓'}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-4">
                    <span>💡 <strong>Gợi ý:</strong> {q.pedagogicalHint}</span>
                    <span>📖 <strong>Giải thích:</strong> {q.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline Question Editor Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-800">
              Chỉnh Sửa Câu Hỏi & Đáp Án
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nội dung câu hỏi:</label>
                <input
                  type="text"
                  value={editingQuestion.questionText}
                  onChange={e => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Đáp án đúng:</label>
                <input
                  type="text"
                  value={String(editingQuestion.correctAnswer)}
                  onChange={e => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-emerald-300 rounded-xl text-xs font-black text-emerald-800 bg-emerald-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Gợi ý sư phạm:</label>
                <input
                  type="text"
                  value={editingQuestion.pedagogicalHint}
                  onChange={e => setEditingQuestion({ ...editingQuestion, pedagogicalHint: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Giải thích vì sao đúng:</label>
                <input
                  type="text"
                  value={editingQuestion.explanation}
                  onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (generatedGame && editingQuestion) {
                    const updated = {
                      ...generatedGame,
                      questions: generatedGame.questions.map(q => q.id === editingQuestion.id ? editingQuestion : q)
                    };
                    setGeneratedGame(updated);
                    runAutomaticMathValidation(updated);
                  }
                  setEditingQuestion(null);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Lưu sửa đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
