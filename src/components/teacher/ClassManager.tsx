import React, { useState } from 'react';
import { StudentProfile } from '../../types/math';
import { TOPICS } from '../../data/curriculum';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface ClassManagerProps {
  students: StudentProfile[];
  onSaveStudents: (students: StudentProfile[]) => void;
  className: string;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  students,
  onSaveStudents,
  className
}) => {
  const [targetCountInput, setTargetCountInput] = useState<number>(students.length || 32);
  const [newStudentCode, setNewStudentCode] = useState('');
  const [newStudentNote, setNewStudentNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  // Auto-generate H01, H02, ... up to target count
  const handleGenerateRoster = () => {
    const count = Number(targetCountInput);
    if (isNaN(count) || count < 1 || count > 60) {
      alert('Vui lòng nhập sĩ số thực tế từ 1 đến 60 học sinh.');
      return;
    }

    if (students.length > 0) {
      if (!confirm(`Lớp đã có ${students.length} mã học sinh. Thao tác này sẽ tạo danh sách mới gồm ${count} mã (H01 -> H${count < 10 ? '0' + count : count}). Bạn có tiếp tục?`)) {
        return;
      }
    }

    const newRoster: StudentProfile[] = [];
    for (let i = 1; i <= count; i++) {
      const code = `H${i < 10 ? '0' + i : i}`;
      newRoster.push({
        id: `st_${Date.now()}_${i}`,
        code,
        notes: '',
        assignedTasks: [],
        dateAdded: new Date().toISOString().slice(0, 10)
      });
    }
    onSaveStudents(newRoster);
    alert(`Đã khởi tạo danh sách ${count} mã học sinh cho lớp ${className}.`);
  };

  const handleAddSingleStudent = () => {
    const code = newStudentCode.trim().toUpperCase();
    if (!code) {
      alert('Vui lòng nhập mã học sinh (ví dụ: H35).');
      return;
    }
    if (students.some(s => s.code === code)) {
      alert(`Mã học sinh ${code} đã tồn tại trong danh sách!`);
      return;
    }
    const newStudent: StudentProfile = {
      id: `st_${Date.now()}`,
      code,
      notes: newStudentNote.trim(),
      assignedTasks: [],
      dateAdded: new Date().toISOString().slice(0, 10)
    };
    onSaveStudents([...students, newStudent]);
    setNewStudentCode('');
    setNewStudentNote('');
  };

  const handleDeleteStudent = (id: string, code: string) => {
    if (confirm(`Bạn có chắc muốn xóa mã học sinh ${code}?`)) {
      onSaveStudents(students.filter(s => s.id !== id));
    }
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    onSaveStudents(students.map(s => (s.id === editingStudent.id ? editingStudent : s)));
    setEditingStudent(null);
  };

  const handleExportCsv = () => {
    if (students.length === 0) {
      alert('Chưa có học sinh nào trong danh sách.');
      return;
    }
    const headers = ['Mã học sinh', 'Ghi chú sư phạm', 'Số nhiệm vụ gán', 'Ngày thêm'];
    const rows = students.map(s => [
      s.code,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      s.assignedTasks.length,
      s.dateAdded
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DanhSach_${className}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length <= 1) {
        alert('Tệp CSV rỗng hoặc chỉ có dòng tiêu đề.');
        return;
      }
      const imported: StudentProfile[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        const code = parts[0]?.replace(/"/g, '').trim().toUpperCase();
        if (code) {
          const notes = parts[1]?.replace(/"/g, '').trim() || '';
          imported.push({
            id: `st_csv_${Date.now()}_${i}`,
            code,
            notes,
            assignedTasks: [],
            dateAdded: new Date().toISOString().slice(0, 10)
          });
        }
      }
      if (imported.length > 0) {
        onSaveStudents(imported);
        alert(`Đã nhập thành công ${imported.length} học sinh từ tệp CSV.`);
      }
    };
    reader.readAsText(file);
  };

  const filteredStudents = students.filter(s =>
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-800">
              Quản Lý Danh Sách Lớp Thực Nghiệm {className}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bảo mật thông tin: Chỉ sử dụng mã định danh (H01, H02...), không lưu trữ dữ liệu cá nhân nhạy cảm.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Xuất CSV</span>
          </button>
          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Nhập CSV</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />
          </label>
        </div>
      </div>

      {/* Roster Generator & Quick Single Add */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fast Batch Generator */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-800">
            Khởi Tạo Sĩ Số Lớp Tự Động
          </h3>
          <p className="text-xs text-slate-500">
            Nhập sĩ số thật của lớp {className} để tự động tạo danh sách mã H01, H02, H03...
          </p>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={60}
              value={targetCountInput}
              onChange={e => setTargetCountInput(Number(e.target.value))}
              className="w-28 px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-sky-500"
              placeholder="32"
            />
            <button
              onClick={handleGenerateRoster}
              className="flex-1 py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              Tạo danh sách {targetCountInput} học sinh
            </button>
          </div>
        </div>

        {/* Add Individual Student */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-800">
            Thêm Mã Học Sinh Đơn Lẻ
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Mã (H35)"
              value={newStudentCode}
              onChange={e => setNewStudentCode(e.target.value)}
              className="col-span-1 px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 uppercase focus:outline-none focus:border-sky-500 text-xs"
            />
            <input
              type="text"
              placeholder="Ghi chú sư phạm..."
              value={newStudentNote}
              onChange={e => setNewStudentNote(e.target.value)}
              className="col-span-2 px-3 py-2 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 text-xs"
            />
          </div>
          <button
            onClick={handleAddSingleStudent}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            + Thêm vào lớp
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-800">
              Danh Sách Học Sinh ({students.length})
            </h3>
            {students.length === 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                Chưa có học sinh
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo mã hoặc ghi chú..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            {students.length === 0 ? 'Chưa có mã học sinh nào. Hãy nhập sĩ số hoặc thêm mới ở trên.' : 'Không tìm thấy kết quả phù hợp.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">STT</th>
                  <th className="py-3 px-3">Mã học sinh</th>
                  <th className="py-3 px-3">Ghi chú sư phạm</th>
                  <th className="py-3 px-3">Nhiệm vụ gán</th>
                  <th className="py-3 px-3">Ngày thêm</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-black text-sky-800 text-sm">
                      <span className="bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200">
                        {st.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {st.notes || <span className="text-slate-300 italic">Chưa có ghi chú</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {st.assignedTasks.length} nhiệm vụ
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{st.dateAdded}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingStudent(st)}
                          className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Sửa ghi chú"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(st.id, st.code)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa mã học sinh"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-800">
              Chỉnh Sửa Thông Tin Mã {editingStudent.code}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Mã học sinh:</label>
                <input
                  type="text"
                  value={editingStudent.code}
                  onChange={e => setEditingStudent({ ...editingStudent, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold uppercase text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Ghi chú sư phạm cá nhân hóa:</label>
                <textarea
                  rows={3}
                  value={editingStudent.notes}
                  onChange={e => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  placeholder="Ghi chú năng lực, thái độ học tập, dạng toán cần rèn thêm..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStudent}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
