export type TextbookCode = 'kntt' | 'ctst' | 'canhdieu' | 'khac';

export type TopicKey =
  | 'A_DEM_SO'
  | 'B_NHIEU_IT'
  | 'C_SO_SANH'
  | 'D_LIEN_TRUOC_SAU'
  | 'E_TACH_GOP'
  | 'F_PHEP_CONG'
  | 'G_PHEP_TRU'
  | 'H_HINH_HOC'
  | 'I_DO_LUONG'
  | 'J_TOAN_THUC_TE';

export type NumberRange = '0-10' | '0-20' | '0-100';

export type GameTypeCode =
  | 'vuon_so'
  | 'doan_tau'
  | 'ca_sau'
  | 'bong_bong'
  | 'sieu_thi'
  | 'tham_tu'
  | 'ngoi_nha'
  | 'ghep_doi';

export type MasteryLevel = 'MAM_XANH' | 'VUON_CAO' | 'TOA_SANG' | 'CHUA_DU_LIEU';

export type ErrorClassificationCode =
  | 'dem_thieu_thua'
  | 'ghep_so_luong'
  | 'so_sanh_sai'
  | 'nham_thu_tu'
  | 'sai_phep_cong'
  | 'sai_phep_tru'
  | 'chua_nhan_biet_hinh'
  | 'can_nhieu_goi_y';

export interface StudentProfile {
  id: string;
  code: string; // e.g. H01, H02, H03...
  notes: string;
  assignedTasks: string[];
  dateAdded: string;
}

export interface AssessmentRecord {
  id: string;
  studentCode: string;
  skillKey: TopicKey;
  date: string;
  testVersion: 'A' | 'B';
  correctCount: number;
  totalCount: number;
  hintsUsed: number;
  isIndependent: boolean;
  teacherNote: string;
  errorTypes: ErrorClassificationCode[];
}

export interface CurriculumLesson {
  id: string;
  week: number;
  title: string;
  objective: string;
  topicKey: TopicKey;
  numberRange: NumberRange;
  taughtDate?: string;
  status: 'CHUA_DAY' | 'DA_DAY';
}

export interface MathQuestion {
  id: string;
  gameType: GameTypeCode;
  questionText: string;
  visualData: {
    type: 'svg_items' | 'train' | 'compare_groups' | 'bubbles' | 'market_shelf' | 'shapes' | 'number_house' | 'match_pairs';
    items?: { svgType?: string; label?: string }[];
    groupA?: { count: number; svgType: string; label?: string };
    groupB?: { count: number; svgType: string; label?: string };
    trainCars?: (number | null)[];
    houseTop?: number;
    houseLeft?: number;
    houseRight?: number | null;
    shapeName?: string;
    shapeType?: 'circle' | 'square' | 'triangle' | 'rectangle';
    targetShelfItems?: {
      name: string;
      count: number;
      change: number;
      type: 'add' | 'remove';
    };
  };
  options: (string | number)[];
  correctAnswer: string | number;
  pedagogicalHint: string;
  explanation: string;
  difficulty?: 'MAM_XANH' | 'VUON_CAO' | 'TOA_SANG';
}

export interface GameDefinition {
  id: string;
  title: string;
  topicKey: TopicKey;
  lessonTitle: string;
  learningObjective: string;
  numberRange: NumberRange;
  gameType: GameTypeCode;
  difficulty: 'MAM_XANH' | 'VUON_CAO' | 'TOA_SANG';
  questionCount: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  questions: MathQuestion[];
  isDemo?: boolean;
}

export interface StudentGameSessionResult {
  id: string;
  studentCode: string;
  gameId: string;
  gameTitle: string;
  totalQuestions: number;
  correctQuestions: number;
  attemptsCount: number;
  hintsCount: number;
  completedAt: string;
  answers: {
    questionId: string;
    selected: string | number;
    isCorrect: boolean;
    attempts: number;
  }[];
}

export interface AssignedTask {
  id: string;
  title: string;
  skillKey: TopicKey;
  studentCodes: string[];
  gameId: string;
  sessionDate: string;
  status: 'CHUA_GIAO' | 'DA_GIAO' | 'DA_NHAN_KET_QUA';
  difficulty: 'MAM_XANH' | 'VUON_CAO' | 'TOA_SANG';
}
