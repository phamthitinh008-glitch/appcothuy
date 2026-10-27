import React, { useState } from 'react';
import {
  AssignedTask,
  StudentProfile,
  GameDefinition,
  TopicKey,
  StudentGameSessionResult
} from '../../types/math';
import { TOPICS } from '../../data/curriculum';
import {
  Send,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';

interface TaskAssignmentProps {
  tasks: AssignedTask[];
  onSaveTasks: (tasks: AssignedTask[]) => void;
  students: StudentProfile[];
  games: GameDefinition[];
  onImportStudentResult: (result: StudentGameSessionResult) => void;
}

export const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  tasks,
  onSaveTasks,
  students,
  games,
  onImportStudentResult
}) => {
  const [taskTitle, setTaskTitle] = useState('Nhiệm vụ rèn luyện Toán 1');
  const [selectedSkill, setSelectedSkill] = useState<TopicKey>('A_DEM_SO');
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || '');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [difficulty, setDifficulty] = useState<'MAM_XANH' | 'VUON_CAO' | 'TOA_SANG'>('VUON_CAO');

  const approvedGames = games.filter(g => g.approvalStatus === 'APPROVED' || g.isDemo);

  const handleToggleStudent = (code: string) => {
    if (selectedStudents.includes(code)) {
      setSelectedStudents(selectedStudents.filter(c => c !== code));
    } else {
      setSelectedStudents([...selectedStudents, code]);
    }
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.code));
    }
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      alert('Vui lòng nhập tên nhiệm vụ.');
      return;
    }
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một mã học sinh.');
      return;
    }

    const newTask: AssignedTask = {
      id: `task_${Date.now()}`,
      title: taskTitle.trim(),
      skillKey: selectedSkill,
      studentCodes: selectedStudents,
      gameId: selectedGameId || approvedGames[0]?.id || 'demo_game_01',
      sessionDate,
      status: 'DA_GIAO',
      difficulty
    };

    onSaveTasks([newTask, ...tasks]);
    setSelectedStudents([]);
    alert(`Đã giao nhiệm vụ cho ${selectedStudents.length} học sinh thành công!`);
  };

  const handleUpdateStatus = (taskId: string, newStatus: any) => {
    onSaveTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  // Export Task Bundle JSON
  const handleExportTaskJson = (task: AssignedTask) => {
    const game = games.find(g => g.id === task.gameId) || games[0];
    const bundle = {
      taskId: task.id,
      title: task.title,
      studentCodes: task.studentCodes,
      sessionDate: task.sessionDate,
      difficulty: task.difficulty,
      game
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GoiNhiemVu_${task.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Student Result JSON from student's local play
  const handleImportResultFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (json.studentCode && json.gameId) {
          onImportStudentResult(json);
          alert(`Đã nhập kết quả làm bài của học sinh ${json.studentCode} (${json.correctQuestions}/${json.totalQuestions} câu đúng)!`);
        } else {
          alert('Tệp kết quả không hợp lệ.');
        }
      } catch {
        alert('Không đọc được tệp JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-800">
              Giao Nhiệm Vụ Học Tập & Tiếp Nhận Kết Quả
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Giao bài thích ứng theo nhóm hoặc cá nhân mã HS • Xuất gói JSON cho học sinh chơi offline • Nhập kết quả bài làm về hệ thống
          </p>
        </div>

        {/* Import student result button */}
        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Nhập file kết quả của Học sinh (JSON)</span>
          <input type="file" accept=".json" className="hidden" onChange={handleImportResultFile} />
        </label>
      </div>

      {/* Assignment Creator Form */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Tạo Lượt Giao Nhiệm Vụ Mới
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">Tên nhiệm vụ / Buổi học:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold"
              placeholder="Ví dụ: Luyện tập cuối tuần 8 - Phép cộng phạm vi 10"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Kỹ năng mục tiêu:</label>
            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value as TopicKey)}
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
            <label className="text-xs font-bold text-slate-600 block mb-1">Chọn trò chơi đã duyệt:</label>
            <select
              value={selectedGameId}
              onChange={e => setSelectedGameId(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-sky-800"
            >
              {approvedGames.map(g => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Mức độ giao:</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="MAM_XANH">Mầm Xanh (Củng cố)</option>
              <option value="VUON_CAO">Vươn Cao (Rèn luyện)</option>
              <option value="TOA_SANG">Tỏa Sáng (Thử thách)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Ngày giao / Hạn hoàn thành:</label>
            <input
              type="date"
              value={sessionDate}
              onChange={e => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            />
          </div>
        </div>

        {/* Student Picker Checklist */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              Chọn mã học sinh nhận nhiệm vụ ({selectedStudents.length} đã chọn):
            </label>
            <button
              type="button"
              onClick={handleSelectAllStudents}
              className="text-xs text-sky-600 hover:text-sky-800 font-bold"
            >
              {selectedStudents.length === students.length ? 'Bỏ chọn tất cả' : 'Chọn toàn bộ lớp'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
            {students.map(st => {
              const isChecked = selectedStudents.includes(st.code);
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleToggleStudent(st.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-sky-600 border-sky-700 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {st.code}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleCreateTask}
          className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
        >
          Xác nhận giao nhiệm vụ
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Danh Sách Các Lượt Giao Nhiệm Vụ ({tasks.length})
        </h3>

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Chưa có nhiệm vụ nào được giao.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Tên nhiệm vụ</th>
                  <th className="py-3 px-3">Kỹ năng</th>
                  <th className="py-3 px-3">Học sinh được giao</th>
                  <th className="py-3 px-3">Mức độ</th>
                  <th className="py-3 px-3">Ngày</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Xuất gói JSON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map(task => {
                  const topic = TOPICS.find(t => t.key === task.skillKey);
                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-extrabold text-slate-800">{task.title}</td>
                      <td className="py-3 px-3 font-bold text-slate-600">{topic?.name}</td>
                      <td className="py-3 px-3 font-black text-sky-800">
                        {task.studentCodes.slice(0, 5).join(', ')}
                        {task.studentCodes.length > 5 ? ` +${task.studentCodes.length - 5}` : ''}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {task.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{task.sessionDate}</td>
                      <td className="py-3 px-3">
                        <select
                          value={task.status}
                          onChange={e => handleUpdateStatus(task.id, e.target.value)}
                          className={`font-black text-xs px-2 py-1 rounded-lg border cursor-pointer ${
                            task.status === 'DA_NHAN_KET_QUA'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : task.status === 'DA_GIAO'
                              ? 'bg-sky-100 text-sky-800 border-sky-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          <option value="CHUA_GIAO">Chưa giao</option>
                          <option value="DA_GIAO">Đã giao</option>
                          <option value="DA_NHAN_KET_QUA">Đã nhận kết quả</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleExportTaskJson(task)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg font-bold border border-sky-200 transition-colors"
                        >
                          Xuất JSON
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
    </div>
  );
};
