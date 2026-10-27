import {
  StudentProfile,
  CurriculumLesson,
  GameDefinition,
  AssessmentRecord,
  StudentGameSessionResult,
  AssignedTask,
  TextbookCode,
  MasteryLevel,
  TopicKey,
  ErrorClassificationCode
} from '../types/math';
import {
  INITIAL_CURRICULUM_LESSONS,
  SAMPLE_APPROVED_GAMES,
  ERROR_CLASSIFICATIONS
} from '../data/curriculum';

export interface AppSettings {
  textbook: TextbookCode;
  schoolName: string;
  authorName: string;
  className: string;
  schoolYear: string;
  location: string;
  teacherAvatarUrl: string;
  appLogoText: string;
  mamXanhThreshold: number; // default 60
  vuonCaoThreshold: number; // default 80
  isDemoMode: boolean; // toggle between Real Data and Demo Data
}

const DEFAULT_SETTINGS: AppSettings = {
  textbook: 'kntt',
  schoolName: 'Tiểu học Hiển Khánh',
  authorName: 'Trịnh Thị Chung Thủy',
  className: '1A3',
  schoolYear: '2026–2027',
  location: 'Xã Hiển Khánh, tỉnh Ninh Bình',
  teacherAvatarUrl: '',
  appLogoText: 'TOÁN KHỞI ĐẦU AI',
  mamXanhThreshold: 60,
  vuonCaoThreshold: 80,
  isDemoMode: false
};

const STORAGE_KEYS = {
  SETTINGS: 'toankhoidau_settings',
  STUDENTS: 'toankhoidau_students',
  CURRICULUM: 'toankhoidau_curriculum',
  GAMES: 'toankhoidau_games',
  ASSESSMENTS: 'toankhoidau_assessments',
  SESSION_RESULTS: 'toankhoidau_session_results',
  ASSIGNED_TASKS: 'toankhoidau_assigned_tasks'
};

export class AppStorage {
  // Settings
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Students (Lớp 1A3)
  static getStudents(): StudentProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveStudents(students: StudentProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  // Curriculum Lessons
  static getLessons(): CurriculumLesson[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
      return data ? JSON.parse(data) : INITIAL_CURRICULUM_LESSONS;
    } catch {
      return INITIAL_CURRICULUM_LESSONS;
    }
  }

  static saveLessons(lessons: CurriculumLesson[]): void {
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(lessons));
  }

  // Games Bank
  static getGames(): GameDefinition[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES);
      return data ? JSON.parse(data) : SAMPLE_APPROVED_GAMES;
    } catch {
      return SAMPLE_APPROVED_GAMES;
    }
  }

  static saveGames(games: GameDefinition[]): void {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }

  // Assessments
  static getAssessments(): AssessmentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveAssessments(records: AssessmentRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(records));
  }

  // Student Session Results
  static getSessionResults(): StudentGameSessionResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveSessionResults(results: StudentGameSessionResult[]): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_RESULTS, JSON.stringify(results));
  }

  // Assigned Tasks
  static getAssignedTasks(): AssignedTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNED_TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveAssignedTasks(tasks: AssignedTask[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSIGNED_TASKS, JSON.stringify(tasks));
  }

  // Full Backup Export
  static exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      students: this.getStudents(),
      curriculum: this.getLessons(),
      games: this.getGames(),
      assessments: this.getAssessments(),
      sessionResults: this.getSessionResults(),
      assignedTasks: this.getAssignedTasks()
    };
    return JSON.stringify(backup, null, 2);
  }

  // Full Restore
  static restoreFullBackup(jsonString: string): boolean {
    try {
      const backup = JSON.parse(jsonString);
      if (backup.settings) this.saveSettings(backup.settings);
      if (backup.students) this.saveStudents(backup.students);
      if (backup.curriculum) this.saveLessons(backup.curriculum);
      if (backup.games) this.saveGames(backup.games);
      if (backup.assessments) this.saveAssessments(backup.assessments);
      if (backup.sessionResults) this.saveSessionResults(backup.sessionResults);
      if (backup.assignedTasks) this.saveAssignedTasks(backup.assignedTasks);
      return true;
    } catch (err) {
      console.error('Failed to restore backup', err);
      return false;
    }
  }

  // Reset to clean real state
  static resetToEmptyRealData(): void {
    const settings = this.getSettings();
    settings.isDemoMode = false;
    this.saveSettings(settings);
    this.saveStudents([]);
    this.saveAssessments([]);
    this.saveSessionResults([]);
    this.saveAssignedTasks([]);
  }

  // Seed Demo Data for testing UI (explicitly labeled demo)
  static seedDemoData(): void {
    const demoStudents: StudentProfile[] = [
      { id: 'st_1', code: 'H01', notes: 'Tiếp thu nhanh, hay xung phong phát biểu', assignedTasks: ['task_01'], dateAdded: '2026-09-05' },
      { id: 'st_2', code: 'H02', notes: 'Cần chú ý rèn kỹ năng tách - gộp số', assignedTasks: ['task_02'], dateAdded: '2026-09-05' },
      { id: 'st_3', code: 'H03', notes: 'Thích các trò chơi hình học trực quan', assignedTasks: [], dateAdded: '2026-09-05' },
      { id: 'st_4', code: 'H04', notes: 'Thao tác đếm đôi khi bị sót số', assignedTasks: ['task_01'], dateAdded: '2026-09-05' },
      { id: 'st_5', code: 'H05', notes: 'Làm tốt phép cộng, cần luyện thêm phép trừ', assignedTasks: [], dateAdded: '2026-09-05' }
    ];

    const demoAssessments: AssessmentRecord[] = [
      {
        id: 'as_d1',
        studentCode: 'H01',
        skillKey: 'A_DEM_SO',
        date: '2026-09-10',
        testVersion: 'A',
        correctCount: 5,
        totalCount: 5,
        hintsUsed: 0,
        isIndependent: true,
        teacherNote: 'Hoàn thành xuất sắc bài đếm đề A',
        errorTypes: []
      },
      {
        id: 'as_d2',
        studentCode: 'H01',
        skillKey: 'A_DEM_SO',
        date: '2026-09-18',
        testVersion: 'B',
        correctCount: 5,
        totalCount: 5,
        hintsUsed: 0,
        isIndependent: true,
        teacherNote: 'Đề B đạt kết quả tối đa',
        errorTypes: []
      },
      {
        id: 'as_d3',
        studentCode: 'H02',
        skillKey: 'E_TACH_GOP',
        date: '2026-10-21',
        testVersion: 'A',
        correctCount: 2,
        totalCount: 5,
        hintsUsed: 2,
        isIndependent: false,
        teacherNote: 'Cần gợi ý khi tách số 5 và 6',
        errorTypes: ['can_nhieu_goi_y', 'ghep_so_luong']
      },
      {
        id: 'as_d4',
        studentCode: 'H04',
        skillKey: 'A_DEM_SO',
        date: '2026-09-10',
        testVersion: 'A',
        correctCount: 3,
        totalCount: 5,
        hintsUsed: 1,
        isIndependent: true,
        teacherNote: 'Bị sót 1 quả táo khi đếm nhanh',
        errorTypes: ['dem_thieu_thua']
      }
    ];

    const demoResults: StudentGameSessionResult[] = [
      {
        id: 'res_1',
        studentCode: 'H01',
        gameId: 'demo_game_01',
        gameTitle: 'Vườn Táo Nhiệm Màu (Phạm vi 10)',
        totalQuestions: 8,
        correctQuestions: 8,
        attemptsCount: 8,
        hintsCount: 0,
        completedAt: '2026-10-22T08:30:00Z',
        answers: []
      },
      {
        id: 'res_2',
        studentCode: 'H02',
        gameId: 'demo_game_01',
        gameTitle: 'Vườn Táo Nhiệm Màu (Phạm vi 10)',
        totalQuestions: 8,
        correctQuestions: 6,
        attemptsCount: 11,
        hintsCount: 2,
        completedAt: '2026-10-22T08:45:00Z',
        answers: []
      }
    ];

    const demoTasks: AssignedTask[] = [
      {
        id: 'task_01',
        title: 'Nhiệm vụ rèn đếm vườn táo',
        skillKey: 'A_DEM_SO',
        studentCodes: ['H01', 'H04'],
        gameId: 'demo_game_01',
        sessionDate: '2026-10-24',
        status: 'DA_NHAN_KET_QUA',
        difficulty: 'VUON_CAO'
      },
      {
        id: 'task_02',
        title: 'Nhiệm vụ rèn cấu tạo tách gộp',
        skillKey: 'E_TACH_GOP',
        studentCodes: ['H02'],
        gameId: 'demo_game_02',
        sessionDate: '2026-10-25',
        status: 'DA_GIAO',
        difficulty: 'MAM_XANH'
      }
    ];

    const settings = this.getSettings();
    settings.isDemoMode = true;
    this.saveSettings(settings);
    this.saveStudents(demoStudents);
    this.saveAssessments(demoAssessments);
    this.saveSessionResults(demoResults);
    this.saveAssignedTasks(demoTasks);
  }

  // Calculate Student Skill Mastery based on strict pedagogical rules
  static calculateStudentSkillMastery(
    studentCode: string,
    skillKey: TopicKey
  ): {
    level: MasteryLevel;
    scorePercent: number;
    testsCount: number;
    independentTestsCount: number;
    avgHints: number;
    description: string;
  } {
    const settings = this.getSettings();
    const records = this.getAssessments().filter(
      r => r.studentCode === studentCode && r.skillKey === skillKey
    );

    if (records.length === 0) {
      return {
        level: 'CHUA_DU_LIEU',
        scorePercent: 0,
        testsCount: 0,
        independentTestsCount: 0,
        avgHints: 0,
        description: 'Chưa đủ dữ liệu khảo sát'
      };
    }

    const totalQuestions = records.reduce((acc, r) => acc + r.totalCount, 0);
    const correctQuestions = records.reduce((acc, r) => acc + r.correctCount, 0);
    const scorePercent = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
    const independentRecords = records.filter(r => r.isIndependent && (r.correctCount / r.totalCount) >= (settings.vuonCaoThreshold / 100));
    const totalHints = records.reduce((acc, r) => acc + r.hintsUsed, 0);
    const avgHints = Number((totalHints / records.length).toFixed(1));

    let level: MasteryLevel = 'MAM_XANH';
    let description = '';

    if (scorePercent < settings.mamXanhThreshold || records.some(r => !r.isIndependent && r.hintsUsed >= 2)) {
      level = 'MAM_XANH';
      description = 'Mầm Xanh: Cần hỗ trợ trực quan, củng cố kiến thức nền tảng';
    } else if (scorePercent >= settings.vuonCaoThreshold && independentRecords.length >= 2) {
      level = 'TOA_SANG';
      description = 'Tỏa Sáng: Đã đạt vững chắc qua 2 lần kiểm tra độc lập, sẵn sàng thử thách';
    } else {
      level = 'VUON_CAO';
      description = 'Vươn Cao: Đang luyện tập tốt, tiếp tục rèn luyện kỹ năng';
    }

    return {
      level,
      scorePercent,
      testsCount: records.length,
      independentTestsCount: independentRecords.length,
      avgHints,
      description
    };
  }
}
