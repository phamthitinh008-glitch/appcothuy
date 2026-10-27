import React, { useState } from 'react';
import {
  CurriculumLesson,
  TextbookCode,
  TopicKey,
  NumberRange
} from '../../types/math';
import { TEXTBOOKS, TOPICS } from '../../data/curriculum';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Plus,
  Calendar,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';

interface CurriculumConfigProps {
  lessons: CurriculumLesson[];
  onSaveLessons: (lessons: CurriculumLesson[]) => void;
  selectedTextbook: TextbookCode;
  onChangeTextbook: (textbook: TextbookCode) => void;
}

export const CurriculumConfig: React.FC<CurriculumConfigProps> = ({
  lessons,
  onSaveLessons,
  selectedTextbook,
  onChangeTextbook
}) => {
  const [newWeek, setNewWeek] = useState<number>(11);
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newTopicKey, setNewTopicKey] = useState<TopicKey>('F_PHEP_CONG');
  const [newNumberRange, setNewNumberRange] = useState<NumberRange>('0-10');
  const [newTaughtDate, setNewTaughtDate] = useState('');
  const [newStatus, setNewStatus] = useState<'CHUA_DAY' | 'DA_DAY'>('CHUA_DAY');

  const handleToggleLessonStatus = (id: string) => {
    onSaveLessons(
      lessons.map(l => {
        if (l.id === id) {
          const nextStatus = l.status === 'DA_DAY' ? 'CHUA_DAY' : 'DA_DAY';
          return {
            ...l,
            status: nextStatus,
            taughtDate: nextStatus === 'DA_DAY' ? (l.taughtDate || new Date().toISOString().slice(0, 10)) : undefined
          };
        }
        return l;
      })
    );
  };

  const handleAddLesson = () => {
    if (!newTitle.trim()) {
      alert('Vui lòng nhập tên bài học.');
      return;
    }
    const newLesson: CurriculumLesson = {
      id: `les_${Date.now()}`,
      week: Number(newWeek) || 1,
      title: newTitle.trim(),
      objective: newObjective.trim() || 'Củng cố kiến thức chuẩn GDPT 2018',
      topicKey: newTopicKey,
      numberRange: newNumberRange,
      taughtDate: newStatus === 'DA_DAY' ? (newTaughtDate || new Date().toISOString().slice(0, 10)) : undefined,
      status: newStatus
    };
    onSaveLessons([...lessons, newLesson]);
    setNewTitle('');
    setNewObjective('');
  };

  const taughtCount = lessons.filter(l => l.status === 'DA_DAY').length;

  return (
    <div className="space-y-6">
      {/* Textbook Selector Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-600" />
          <div>
            <h2 className="text-xl font-black text-slate-800">
              Cấu Hình Bộ Sách & Kế Hoạch Dạy Học Toán 1
            </h2>
            <p className="text-xs text-slate-500">
              Chương trình GDPT 2018 • Giáo viên chủ động chọn bộ sách và xác định bài học đã dạy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {TEXTBOOKS.map(tb => {
            const isSelected = selectedTextbook === tb.code;
            return (
              <div
                key={tb.code}
                onClick={() => onChangeTextbook(tb.code)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-50 border-sky-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-sky-800 uppercase">
                    {tb.code.toUpperCase()}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{tb.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{tb.publisher}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10 Standard GDPT 2018 Topics Overview */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-800">
              10 Chủ Đề Toán Lớp 1 (Chương Trình GDPT 2018)
            </h3>
            <p className="text-xs text-slate-500">
              Hệ thống tuyệt đối không sinh phép nhân, phép chia, phân số hay kiến thức vượt chuẩn.
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-xl border border-emerald-200">
            Đã dạy: {taughtCount} / {lessons.length} bài
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TOPICS.map(topic => {
            const lessonsInTopic = lessons.filter(l => l.topicKey === topic.key);
            const taughtInTopic = lessonsInTopic.filter(l => l.status === 'DA_DAY').length;

            return (
              <div
                key={topic.key}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-black uppercase text-sky-700 tracking-wider">
                    {topic.code}
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mt-0.5 line-clamp-2">
                    {topic.name}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{lessonsInTopic.length} bài</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      taughtInTopic > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {taughtInTopic > 0 ? `${taughtInTopic} đã dạy` : 'Chưa dạy'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Lesson Form */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Thêm Bài Học Mới Vào Kế Hoạch Giảng Dạy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Tuần học:</label>
            <input
              type="number"
              min={1}
              max={35}
              value={newWeek}
              onChange={e => setNewWeek(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Chủ đề:</label>
            <select
              value={newTopicKey}
              onChange={e => setNewTopicKey(e.target.value as TopicKey)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              {TOPICS.map(t => (
                <option key={t.key} value={t.key}>
                  {t.code}: {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Phạm vi số:</label>
            <select
              value={newNumberRange}
              onChange={e => setNewNumberRange(e.target.value as NumberRange)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="0-10">Trong phạm vi 10 (0–10)</option>
              <option value="0-20">Trong phạm vi 20 (0–20)</option>
              <option value="0-100">Trong phạm vi 100 (0–100)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Trạng thái:</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="CHUA_DAY">Chưa dạy</option>
              <option value="DA_DAY">Đã dạy</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">Tên bài học:</label>
            <input
              type="text"
              placeholder="Ví dụ: Phép cộng trong phạm vi 6"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">Yêu cầu cần đạt:</label>
            <input
              type="text"
              placeholder="Ví dụ: Biết thao tác gộp và thực hiện tính nhẩm 4 + 2 = 6"
              value={newObjective}
              onChange={e => setNewObjective(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <button
          onClick={handleAddLesson}
          className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
        >
          + Thêm bài vào chương trình
        </button>
      </div>

      {/* Lesson List Table */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Danh Mục Bài Học & Trạng Thái Giảng Dạy ({lessons.length} bài)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Tuần</th>
                <th className="py-3 px-3">Tên bài học</th>
                <th className="py-3 px-3">Chủ đề</th>
                <th className="py-3 px-3">Phạm vi</th>
                <th className="py-3 px-3">Mục tiêu cần đạt</th>
                <th className="py-3 px-3">Ngày đã dạy</th>
                <th className="py-3 px-3 text-right">Trạng thái (Bấm đổi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lessons.map(les => {
                const isTaught = les.status === 'DA_DAY';
                const topic = TOPICS.find(t => t.key === les.topicKey);
                return (
                  <tr key={les.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-600">Tuần {les.week}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-800">{les.title}</td>
                    <td className="py-3 px-3">
                      <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold border border-sky-100">
                        {topic?.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-indigo-700">{les.numberRange}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{les.objective}</td>
                    <td className="py-3 px-3 text-slate-400">{les.taughtDate || '---'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleLessonStatus(les.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                          isTaught
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                      >
                        {isTaught ? '✓ Đã dạy' : 'Chưa dạy'}
                      </button>
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
