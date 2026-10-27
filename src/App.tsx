/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppStorage, AppSettings } from './utils/storage';
import {
  StudentProfile,
  CurriculumLesson,
  GameDefinition,
  AssessmentRecord,
  StudentGameSessionResult,
  AssignedTask
} from './types/math';

// Teacher Hub Components
import { TeacherHeader } from './components/teacher/TeacherHeader';
import { DashboardOverview } from './components/teacher/DashboardOverview';
import { ClassManager } from './components/teacher/ClassManager';
import { CurriculumConfig } from './components/teacher/CurriculumConfig';
import { AssessmentSurvey } from './components/teacher/AssessmentSurvey';
import { SkillMap } from './components/teacher/SkillMap';
import { AiGameWorkshop } from './components/teacher/AiGameWorkshop';
import { GameBank } from './components/teacher/GameBank';
import { ErrorAnalysis } from './components/teacher/ErrorAnalysis';
import { TaskAssignment } from './components/teacher/TaskAssignment';
import { ReportEvidence } from './components/teacher/ReportEvidence';
import { ProjectGuide } from './components/teacher/ProjectGuide';

// Student Mode Component
import { StudentGameZone } from './components/student/StudentGameZone';

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Map,
  Sparkles,
  Archive,
  AlertTriangle,
  Send,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<'teacher' | 'student'>('teacher');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // App State loaded from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => AppStorage.getSettings());
  const [students, setStudents] = useState<StudentProfile[]>(() => AppStorage.getStudents());
  const [lessons, setLessons] = useState<CurriculumLesson[]>(() => AppStorage.getLessons());
  const [games, setGames] = useState<GameDefinition[]>(() => AppStorage.getGames());
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(() => AppStorage.getAssessments());
  const [sessionResults, setSessionResults] = useState<StudentGameSessionResult[]>(() => AppStorage.getSessionResults());
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>(() => AppStorage.getAssignedTasks());

  const refreshAllData = () => {
    setSettings(AppStorage.getSettings());
    setStudents(AppStorage.getStudents());
    setLessons(AppStorage.getLessons());
    setGames(AppStorage.getGames());
    setAssessments(AppStorage.getAssessments());
    setSessionResults(AppStorage.getSessionResults());
    setAssignedTasks(AppStorage.getAssignedTasks());
  };

  const handleSaveStudents = (newStudents: StudentProfile[]) => {
    setStudents(newStudents);
    AppStorage.saveStudents(newStudents);
  };

  const handleSaveLessons = (newLessons: CurriculumLesson[]) => {
    setLessons(newLessons);
    AppStorage.saveLessons(newLessons);
  };

  const handleSaveGames = (newGames: GameDefinition[]) => {
    setGames(newGames);
    AppStorage.saveGames(newGames);
  };

  const handleSaveAssessments = (newRecords: AssessmentRecord[]) => {
    setAssessments(newRecords);
    AppStorage.saveAssessments(newRecords);
  };

  const handleSaveSessionResult = (res: StudentGameSessionResult) => {
    const updated = [res, ...sessionResults];
    setSessionResults(updated);
    AppStorage.saveSessionResults(updated);
  };

  const handleSaveAssignedTasks = (tasks: AssignedTask[]) => {
    setAssignedTasks(tasks);
    AppStorage.saveAssignedTasks(tasks);
  };

  const handleAssignRemedialTask = (taskName: string, studentCode: string, skillKey: string) => {
    const newTask: AssignedTask = {
      id: `task_rem_${Date.now()}`,
      title: taskName,
      skillKey: skillKey as any,
      studentCodes: [studentCode],
      gameId: games[0]?.id || 'demo_game_01',
      sessionDate: new Date().toISOString().slice(0, 10),
      status: 'DA_GIAO',
      difficulty: 'MAM_XANH'
    };
    handleSaveAssignedTasks([newTask, ...assignedTasks]);
    setActiveTab('tasks');
    alert(`Đã tạo nhiệm vụ củng cố cho học sinh ${studentCode}!`);
  };

  // Navigation Items
  const navTabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'class', label: `Lớp ${settings.className}`, icon: Users },
    { id: 'curriculum', label: 'Chương trình', icon: BookOpen },
    { id: 'assessment', label: 'Khảo sát A/B', icon: ClipboardCheck },
    { id: 'skillmap', label: 'Bản đồ kỹ năng', icon: Map },
    { id: 'workshop', label: 'Xưởng AI', icon: Sparkles, highlight: true },
    { id: 'bank', label: 'Kho trò chơi', icon: Archive },
    { id: 'errors', label: 'Lỗi sai & Hỗ trợ', icon: AlertTriangle },
    { id: 'tasks', label: 'Giao nhiệm vụ', icon: Send },
    { id: 'reports', label: 'Báo cáo & Minh chứng', icon: BarChart3 },
    { id: 'guide', label: 'Hồ sơ khoa học', icon: HelpCircle }
  ];

  // If in Student Mode, render pure isolated student experience
  if (activeMode === 'student') {
    return (
      <StudentGameZone
        availableGames={games}
        onBackToTeacher={() => setActiveMode('teacher')}
        onSaveSessionResult={handleSaveSessionResult}
        studentCodePreset={students[0]?.code || 'H01'}
      />
    );
  }

  // Teacher Hub Mode
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Teacher Top Header */}
      <TeacherHeader
        settings={settings}
        onUpdateSettings={setSettings}
        onSwitchToStudentMode={() => setActiveMode('student')}
        onRefreshData={refreshAllData}
      />

      {/* Teacher Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 px-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : tab.highlight
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            students={students}
            assessments={assessments}
            games={games}
            sessionResults={sessionResults}
            assignedTasks={assignedTasks}
            onNavigate={setActiveTab}
            isDemoMode={settings.isDemoMode}
          />
        )}

        {activeTab === 'class' && (
          <ClassManager
            students={students}
            onSaveStudents={handleSaveStudents}
            className={settings.className}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumConfig
            lessons={lessons}
            onSaveLessons={handleSaveLessons}
            selectedTextbook={settings.textbook}
            onChangeTextbook={tb => {
              const updated = { ...settings, textbook: tb };
              setSettings(updated);
              AppStorage.saveSettings(updated);
            }}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentSurvey
            students={students}
            assessments={assessments}
            onSaveAssessments={handleSaveAssessments}
          />
        )}

        {activeTab === 'skillmap' && (
          <SkillMap
            students={students}
            assessments={assessments}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}

        {activeTab === 'workshop' && (
          <AiGameWorkshop
            lessons={lessons}
            onSaveGameToBank={game => {
              handleSaveGames([game, ...games]);
              setActiveTab('bank');
            }}
          />
        )}

        {activeTab === 'bank' && (
          <GameBank
            games={games}
            onSaveGames={handleSaveGames}
            onPreviewGameInZone={game => {
              setActiveMode('student');
            }}
          />
        )}

        {activeTab === 'errors' && (
          <ErrorAnalysis
            assessments={assessments}
            sessionResults={sessionResults}
            students={students}
            onAssignRemedialTask={handleAssignRemedialTask}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskAssignment
            tasks={assignedTasks}
            onSaveTasks={handleSaveAssignedTasks}
            students={students}
            games={games}
            onImportStudentResult={handleSaveSessionResult}
          />
        )}

        {activeTab === 'reports' && (
          <ReportEvidence
            students={students}
            assessments={assessments}
            sessionResults={sessionResults}
            assignedTasks={assignedTasks}
            isDemoMode={settings.isDemoMode}
            schoolName={settings.schoolName}
            authorName={settings.authorName}
            className={settings.className}
          />
        )}

        {activeTab === 'guide' && <ProjectGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>TOÁN KHỞI ĐẦU AI</strong> – Ứng dụng trí tuệ nhân tạo trong thiết kế trò chơi học tập tương tác và tổ chức dạy học Toán thích ứng cho học sinh lớp 1
          </div>
          <div className="font-semibold text-slate-600">
            Trịnh Thị Chung Thủy • Tiểu học Hiển Khánh, Ninh Bình • Lớp 1A3 (2026–2027)
          </div>
        </div>
      </footer>
    </div>
  );
}
