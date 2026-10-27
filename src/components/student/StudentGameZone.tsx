import React, { useState, useEffect } from 'react';
import { GameDefinition, MathQuestion, StudentGameSessionResult } from '../../types/math';
import { GAMES_INFO } from '../../data/curriculum';
import { ItemSvgRenderer, ShapeSvgRenderer, CrocodileMouth } from '../SvgVisuals';
import { soundFx } from '../../utils/audio';
import { generateStandaloneHtml5 } from '../../utils/html5Exporter';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Star,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface StudentGameZoneProps {
  availableGames: GameDefinition[];
  onBackToTeacher: () => void;
  onSaveSessionResult: (result: StudentGameSessionResult) => void;
  studentCodePreset?: string;
}

export const StudentGameZone: React.FC<StudentGameZoneProps> = ({
  availableGames,
  onBackToTeacher,
  onSaveSessionResult,
  studentCodePreset = 'H01'
}) => {
  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentCode, setStudentCode] = useState(studentCodePreset);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'lobby' | 'playing' | 'summary'>('lobby');
  const [sessionAnswers, setSessionAnswers] = useState<any[]>([]);

  // Sound mute sync
  useEffect(() => {
    soundFx.setMuted(isMuted);
  }, [isMuted]);

  const approvedGames = availableGames.filter(g => g.approvalStatus === 'APPROVED' || g.isDemo);

  const startPlaying = (game: GameDefinition) => {
    soundFx.playTap();
    setSelectedGame(game);
    setCurrentQuestionIdx(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setHintsCount(0);
    setCurrentAttempts(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setIsFinished(false);
    setSessionAnswers([]);
    setActiveTab('playing');
  };

  const currentQ: MathQuestion | undefined = selectedGame?.questions[currentQuestionIdx];

  const handleSelectAnswer = (option: string | number) => {
    if (isAnswered && isCorrect) return; // Already passed this question
    soundFx.playTap();
    setSelectedAnswer(option);
    const newAttempts = currentAttempts + 1;
    setCurrentAttempts(newAttempts);
    setTotalAttempts(prev => prev + 1);

    const isMatch = String(option).trim() === String(currentQ?.correctAnswer).trim();

    if (isMatch) {
      soundFx.playSuccess();
      setIsCorrect(true);
      setIsAnswered(true);
      setShowHint(false);
      if (newAttempts === 1) {
        setCorrectCount(prev => prev + 1);
      }
      setSessionAnswers(prev => [
        ...prev,
        {
          questionId: currentQ?.id,
          selected: option,
          isCorrect: true,
          attempts: newAttempts
        }
      ]);
    } else {
      soundFx.playTryAgain();
      setIsCorrect(false);
      setShowHint(true);
      setHintsCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedGame) return;
    soundFx.playTap();
    if (currentQuestionIdx + 1 < selectedGame.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setCurrentAttempts(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Completed game
      setIsFinished(true);
      setActiveTab('summary');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      const result: StudentGameSessionResult = {
        id: `sess_${Date.now()}`,
        studentCode: studentCode.trim().toUpperCase() || 'H01',
        gameId: selectedGame.id,
        gameTitle: selectedGame.title,
        totalQuestions: selectedGame.questions.length,
        correctQuestions: correctCount + (isCorrect && currentAttempts === 1 ? 0 : 0),
        attemptsCount: totalAttempts,
        hintsCount: hintsCount,
        completedAt: new Date().toISOString(),
        answers: sessionAnswers
      };
      onSaveSessionResult(result);
    }
  };

  const handleDownloadStandalone = (game: GameDefinition, e: React.MouseEvent) => {
    e.stopPropagation();
    const htmlContent = generateStandaloneHtml5(game);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GocToanVui_${game.gameType}_${game.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSessionResult = () => {
    if (!selectedGame) return;
    const resultObj = {
      studentCode,
      gameId: selectedGame.id,
      gameTitle: selectedGame.title,
      totalQuestions: selectedGame.questions.length,
      correctQuestions: correctCount,
      attemptsCount: totalAttempts,
      hintsCount: hintsCount,
      completedAt: new Date().toISOString(),
      answers: sessionAnswers
    };
    const blob = new Blob([JSON.stringify(resultObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KetQua_${studentCode}_${selectedGame.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50 to-amber-50 text-slate-800 flex flex-col">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-sky-100 px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToTeacher}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 transition-colors"
              title="Quay lại Trung tâm Giáo viên"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trung Tâm GV</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="font-extrabold text-sky-700 text-lg md:text-xl tracking-tight">
                GÓC TOÁN VUI 1A3
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs md:text-sm font-bold border border-amber-200">
              <span>Mã HS:</span>
              <input
                type="text"
                value={studentCode}
                onChange={e => setStudentCode(e.target.value.toUpperCase())}
                className="w-14 font-black text-amber-800 bg-transparent text-center focus:outline-none uppercase"
                placeholder="H01"
              />
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col justify-center">
        {/* LOBBY / GAME SELECTOR */}
        {activeTab === 'lobby' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-800 rounded-full text-sm font-bold border border-sky-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Toán Khởi Đầu AI • Chạm số – Hiểu nhanh – Học vui</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-sky-900">
                Chào mừng con đến với Thế Giới Toán Vui!
              </h1>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
                Con hãy chọn một trò chơi dưới đây để bắt đầu thử tài tính toán nhé!
              </p>
            </div>

            {/* List of 8 Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GAMES_INFO.map(info => {
                const gameInst = approvedGames.find(g => g.gameType === info.code);
                return (
                  <div
                    key={info.code}
                    className="bg-white rounded-3xl p-5 border-3 border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black tracking-wide px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg border border-sky-200">
                          {info.badge}
                        </span>
                        {gameInst?.isDemo && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                            Demo
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-sky-600 transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {info.subtitle}
                      </p>
                    </div>

                    <div className="mt-5 space-y-2">
                      <button
                        onClick={() => startPlaying(gameInst || approvedGames[0])}
                        className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-sm hover:shadow transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Chơi ngay</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {gameInst && (
                        <button
                          onClick={e => handleDownloadStandalone(gameInst, e)}
                          className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl border border-sky-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Tải gói HTML5 chơi offline trên máy tính, iPad không cần mạng"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải HTML5 Offline</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {activeTab === 'playing' && currentQ && selectedGame && (
          <div className="bg-white rounded-3xl border-3 border-sky-200 shadow-xl p-5 md:p-8 max-w-3xl mx-auto w-full relative">
            {/* Question Header & Progress Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setActiveTab('lobby')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Chọn trò chơi khác</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-sky-700">
                  Câu {currentQuestionIdx + 1} / {selectedGame.questions.length}
                </span>
                <button
                  onClick={() => soundFx.speakVietnamese(currentQ.questionText)}
                  className="p-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 border border-indigo-200"
                  title="Nghe giọng đọc câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Đọc đề</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
              <div
                className="bg-gradient-to-r from-emerald-400 to-sky-500 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIdx + 1) / selectedGame.questions.length) * 100}%`
                }}
              />
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-black text-slate-900 text-center mb-6 leading-snug">
              {currentQ.questionText}
            </h2>

            {/* Visual Interactive Stage */}
            <div className="bg-slate-50 border-2 border-dashed border-sky-200 rounded-3xl p-6 min-h-[180px] flex flex-wrap items-center justify-center gap-4 mb-6 relative">
              {currentQ.visualData.type === 'svg_items' && currentQ.visualData.items && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {currentQ.visualData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer transition-transform hover:scale-125 active:scale-95 p-1"
                      onClick={() => soundFx.playTap()}
                      title="Chạm để đếm"
                    >
                      <ItemSvgRenderer type={item.svgType || 'apple'} size={54} />
                    </div>
                  ))}
                </div>
              )}

              {currentQ.visualData.type === 'compare_groups' && currentQ.visualData.groupA && currentQ.visualData.groupB && (
                <div className="flex items-center justify-center gap-6 md:gap-12 w-full">
                  <div className="flex flex-col items-center bg-white p-4 rounded-2xl border-2 border-sky-100 shadow-xs">
                    <span className="font-extrabold text-sky-700 text-2xl mb-2">
                      {currentQ.visualData.groupA.count}
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-w-[140px] justify-center">
                      {Array(currentQ.visualData.groupA.count).fill(0).map((_, i) => (
                        <ItemSvgRenderer key={i} type={currentQ.visualData.groupA!.svgType} size={36} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <CrocodileMouth symbol={isAnswered ? String(currentQ.correctAnswer) : '>'} size={90} />
                  </div>

                  <div className="flex flex-col items-center bg-white p-4 rounded-2xl border-2 border-sky-100 shadow-xs">
                    <span className="font-extrabold text-sky-700 text-2xl mb-2">
                      {currentQ.visualData.groupB.count}
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-w-[140px] justify-center">
                      {Array(currentQ.visualData.groupB.count).fill(0).map((_, i) => (
                        <ItemSvgRenderer key={i} type={currentQ.visualData.groupB!.svgType} size={36} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentQ.visualData.type === 'train' && (
                <div className="flex items-center justify-center flex-wrap gap-2">
                  <span className="text-4xl mr-1">🚂</span>
                  {(currentQ.visualData.trainCars || []).map((carVal, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 rounded-2xl border-3 text-2xl font-black ${
                        carVal === null
                          ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                          : 'bg-sky-100 border-sky-400 text-sky-900'
                      }`}
                    >
                      {carVal === null ? (isAnswered ? currentQ.correctAnswer : '?') : carVal}
                    </div>
                  ))}
                </div>
              )}

              {currentQ.visualData.type === 'number_house' && (
                <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-5 w-64 text-center shadow-md">
                  <div className="text-3xl font-black text-amber-900 border-b-2 border-amber-300 pb-2 mb-3 flex items-center justify-center gap-2">
                    <span>🏠</span>
                    <span>{currentQ.visualData.houseTop}</span>
                  </div>
                  <div className="flex justify-around items-center">
                    <div className="bg-white border-2 border-amber-300 text-amber-900 font-black text-2xl px-4 py-2 rounded-xl shadow-xs">
                      {currentQ.visualData.houseLeft}
                    </div>
                    <span className="text-xl font-bold text-amber-600">và</span>
                    <div className="bg-white border-2 border-amber-300 text-sky-600 font-black text-2xl px-4 py-2 rounded-xl shadow-xs">
                      {isAnswered ? currentQ.correctAnswer : '?'}
                    </div>
                  </div>
                </div>
              )}

              {currentQ.visualData.type === 'shapes' && currentQ.visualData.shapeType && (
                <ShapeSvgRenderer type={currentQ.visualData.shapeType} size={130} />
              )}

              {currentQ.visualData.type === 'bubbles' && (
                <div className="text-center py-4">
                  <div className="inline-block bg-indigo-50 border-3 border-indigo-300 text-indigo-900 font-black text-3xl md:text-4xl px-8 py-4 rounded-3xl shadow-sm tracking-wider">
                    {currentQ.visualData.items?.[0]?.label || currentQ.questionText}
                  </div>
                </div>
              )}

              {currentQ.visualData.type === 'market_shelf' && currentQ.visualData.targetShelfItems && (
                <div className="text-center space-y-2">
                  <div className="text-4xl">🧺 🍎 🍊</div>
                  <div className="text-base font-bold text-slate-700">
                    Kệ hàng: Ban đầu có {currentQ.visualData.targetShelfItems.count} {currentQ.visualData.targetShelfItems.name},{' '}
                    {currentQ.visualData.targetShelfItems.type === 'add' ? 'thêm' : 'bớt'} {currentQ.visualData.targetShelfItems.change} quả
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                let btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-400';
                if (isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-emerald-400 border-emerald-600 text-white font-black'
                    : 'bg-rose-100 border-rose-400 text-rose-800';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={isAnswered && isCorrect}
                    className={`py-4 px-3 rounded-2xl border-3 text-2xl md:text-3xl font-black transition-all transform active:scale-95 shadow-sm cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Pedagogical Hint & Friendly Feedback */}
            {isAnswered && isCorrect && (
              <div className="bg-emerald-100 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl mb-4 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-base">Con làm rất tốt! 🌟</h4>
                  <p className="text-sm mt-0.5">{currentQ.explanation}</p>
                </div>
              </div>
            )}

            {showHint && !isCorrect && (
              <div className="bg-amber-100 border-2 border-amber-300 text-amber-900 p-4 rounded-2xl mb-4 flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-base">Con thử lại nhé! 💡</h4>
                  <p className="text-sm mt-0.5">{currentQ.pedagogicalHint}</p>
                </div>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && isCorrect && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="py-3 px-8 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl text-base flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <span>{currentQuestionIdx + 1 < selectedGame.questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUMMARY SCREEN */}
        {activeTab === 'summary' && selectedGame && (
          <div className="bg-white rounded-3xl border-3 border-emerald-200 shadow-xl p-6 md:p-10 max-w-xl mx-auto w-full text-center space-y-6">
            <div className="inline-block p-4 bg-emerald-100 text-emerald-700 rounded-full">
              <Star className="w-12 h-12 fill-emerald-500" />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                CHÚC MỪNG CON ĐÃ HOÀN THÀNH!
              </h2>
              <p className="text-slate-600 font-bold mt-1">
                Trò chơi: {selectedGame.title}
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-left space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Mã học sinh:</span>
                <span className="font-black text-slate-800">{studentCode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Số câu đúng ngay:</span>
                <span className="font-black text-emerald-700">{correctCount} / {selectedGame.questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tổng lượt trả lời:</span>
                <span className="font-black text-slate-800">{totalAttempts} lượt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Số lần xem gợi ý:</span>
                <span className="font-black text-amber-700">{hintsCount} lần</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleExportSessionResult}
                className="py-3 px-5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất kết quả gửi Cô giáo</span>
              </button>

              <button
                onClick={() => startPlaying(selectedGame)}
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>

              <button
                onClick={() => setActiveTab('lobby')}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-2xl text-sm transition-colors cursor-pointer"
              >
                <span>Đổi trò chơi</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
