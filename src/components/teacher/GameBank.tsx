import React, { useState } from 'react';
import { GameDefinition, TopicKey } from '../../types/math';
import { TOPICS, GAMES_INFO } from '../../data/curriculum';
import { generateStandaloneHtml5 } from '../../utils/html5Exporter';
import {
  Archive,
  Search,
  Filter,
  Trash2,
  Copy,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Printer,
  Sparkles
} from 'lucide-react';

interface GameBankProps {
  games: GameDefinition[];
  onSaveGames: (games: GameDefinition[]) => void;
  onPreviewGameInZone?: (game: GameDefinition) => void;
}

export const GameBank: React.FC<GameBankProps> = ({
  games,
  onSaveGames,
  onPreviewGameInZone
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [previewGame, setPreviewGame] = useState<GameDefinition | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa trò chơi "${title}"?`)) {
      onSaveGames(games.filter(g => g.id !== id));
    }
  };

  const handleDuplicate = (game: GameDefinition) => {
    const clone: GameDefinition = {
      ...game,
      id: `game_${Date.now()}`,
      title: `${game.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      isDemo: false
    };
    onSaveGames([clone, ...games]);
    alert(`Đã nhân bản trò chơi thành công!`);
  };

  const handleDownloadStandalone = (game: GameDefinition) => {
    const html = generateStandaloneHtml5(game);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TroChoi_${game.gameType}_${game.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredGames = games.filter(g => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || g.topicKey === selectedTopic;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'APPROVED' && (g.approvalStatus === 'APPROVED' || g.isDemo)) ||
      (selectedStatus === 'PENDING' && g.approvalStatus === 'PENDING');
    return matchesSearch && matchesTopic && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-800">
              Ngân Hàng Trò Chơi Học Tập Toán 1 ({games.length} trò chơi)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kho lưu trữ các bộ trò chơi tương tác đã được kiểm định • Cho phép tìm kiếm, nhân bản, xuất gói HTML5
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">Tất cả chủ đề</option>
            {TOPICS.map(t => (
              <option key={t.key} value={t.key}>
                {t.code}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="APPROVED">Đã duyệt / Sẵn sàng</option>
            <option value="PENDING">Chờ giáo viên duyệt</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map(game => {
          const gameInfo = GAMES_INFO.find(g => g.code === game.gameType);
          const isApproved = game.approvalStatus === 'APPROVED' || game.isDemo;

          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-4 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                    {gameInfo?.badge || game.gameType}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {game.isDemo && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded">
                        DỮ LIỆU DEMO
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">{game.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{game.learningObjective}</p>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 font-bold">
                  <span>{game.questions.length} câu</span>
                  <span>•</span>
                  <span>Phạm vi {game.numberRange}</span>
                  <span>•</span>
                  <span>Mức: {game.difficulty}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                <button
                  onClick={() => setPreviewGame(game)}
                  className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                  title="Xem chi tiết các câu hỏi"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem</span>
                </button>

                <button
                  onClick={() => handleDownloadStandalone(game)}
                  className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                  title="Tải gói HTML5 độc lập"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải HTML5</span>
                </button>

                <button
                  onClick={() => handleDuplicate(game)}
                  className="p-2 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors"
                  title="Nhân bản trò chơi"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(game.id, game.title)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Xóa trò chơi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Questions Modal */}
      {previewGame && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-800">{previewGame.title}</h3>
                <p className="text-xs text-slate-500">
                  {previewGame.questions.length} câu • Phạm vi {previewGame.numberRange}
                </p>
              </div>
              <button
                onClick={() => setPreviewGame(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-3">
              {previewGame.questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900">
                    <span className="text-sky-700 font-black mr-1">Câu {idx + 1}:</span>
                    {q.questionText}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 font-bold">Lựa chọn:</span>
                    {q.options.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className={`px-2 py-0.5 rounded font-bold ${
                          String(opt).trim() === String(q.correctAnswer).trim()
                            ? 'bg-emerald-100 text-emerald-900 font-black border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    💡 <strong>Gợi ý:</strong> {q.pedagogicalHint}
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
