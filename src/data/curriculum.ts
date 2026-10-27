import {
  TextbookCode,
  TopicKey,
  GameTypeCode,
  ErrorClassificationCode,
  CurriculumLesson,
  GameDefinition,
  MathQuestion
} from '../types/math';

export const TEXTBOOKS: { code: TextbookCode; name: string; publisher: string }[] = [
  { code: 'kntt', name: 'Kết nối tri thức với cuộc sống', publisher: 'NXB Giáo dục Việt Nam' },
  { code: 'ctst', name: 'Chân trời sáng tạo', publisher: 'NXB Giáo dục Việt Nam' },
  { code: 'canhdieu', name: 'Cánh diều', publisher: 'NXB Đại học Sư phạm & NXB ĐHSP TP.HCM' },
  { code: 'khac', name: 'Bộ sách khác theo chuẩn GDPT 2018', publisher: 'Địa phương quy định' }
];

export const TOPICS: {
  key: TopicKey;
  code: string;
  name: string;
  description: string;
  recommendedGame: GameTypeCode;
}[] = [
  {
    key: 'A_DEM_SO',
    code: 'Chủ đề A',
    name: 'Đếm và nhận biết số',
    description: 'Đếm các đồ vật, con vật, nhận biết mặt số và số lượng tương ứng.',
    recommendedGame: 'vuon_so'
  },
  {
    key: 'B_NHIEU_IT',
    code: 'Chủ đề B',
    name: 'Quan hệ nhiều hơn, ít hơn, bằng nhau',
    description: 'Quan sát và so sánh trực quan số lượng giữa hai nhóm đồ vật.',
    recommendedGame: 'ca_sau'
  },
  {
    key: 'C_SO_SANH',
    code: 'Chủ đề C',
    name: 'So sánh và sắp xếp số',
    description: 'Sử dụng các dấu >, <, = để so sánh số và sắp xếp dãy số từ bé đến lớn hoặc ngược lại.',
    recommendedGame: 'ca_sau'
  },
  {
    key: 'D_LIEN_TRUOC_SAU',
    code: 'Chủ đề D',
    name: 'Số liền trước, liền sau',
    description: 'Tìm số đứng trước và số kế tiếp trong tia số hoặc dãy số tự nhiên.',
    recommendedGame: 'doan_tau'
  },
  {
    key: 'E_TACH_GOP',
    code: 'Chủ đề E',
    name: 'Tách và gộp số',
    description: 'Phân tích một số thành hai phần hoặc gộp hai phần thành một số ban đầu.',
    recommendedGame: 'ngoi_nha'
  },
  {
    key: 'F_PHEP_CONG',
    code: 'Chủ đề F',
    name: 'Phép cộng',
    description: 'Ý nghĩa thêm vào, gộp lại; bảng cộng và tính nhẩm trong phạm vi 10, 20, 100.',
    recommendedGame: 'bong_bong'
  },
  {
    key: 'G_PHEP_TRU',
    code: 'Chủ đề G',
    name: 'Phép trừ',
    description: 'Ý nghĩa bớt đi, lấy đi, tìm phần còn lại; bảng trừ trong phạm vi quy định.',
    recommendedGame: 'bong_bong'
  },
  {
    key: 'H_HINH_HOC',
    code: 'Chủ đề H',
    name: 'Hình phẳng, hình khối',
    description: 'Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật, khối lập phương, khối hộp chữ nhật.',
    recommendedGame: 'tham_tu'
  },
  {
    key: 'I_DO_LUONG',
    code: 'Chủ đề I',
    name: 'Đo lường và thời gian ở mức lớp 1',
    description: 'So sánh dài - ngắn, đo bằng gang tay, bước chân, nhận biết xem đồng hồ giờ đúng.',
    recommendedGame: 'ghep_doi'
  },
  {
    key: 'J_TOAN_THUC_TE',
    code: 'Chủ đề J',
    name: 'Tình huống Toán thực tế đơn giản',
    description: 'Vận dụng giải quyết tình huống mua bán đồ dùng học tập, chia kẹo, thêm bớt quả.',
    recommendedGame: 'sieu_thi'
  }
];

export const GAMES_INFO: {
  code: GameTypeCode;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  themeColor: string;
  defaultTopic: TopicKey;
}[] = [
  {
    code: 'vuon_so',
    title: 'Vườn Số Nhiệm Màu',
    subtitle: 'Đếm đồ vật hoạt hình SVG và chọn số tương ứng',
    badge: 'Đếm & Nhận biết',
    iconName: 'Apple',
    themeColor: 'emerald',
    defaultTopic: 'A_DEM_SO'
  },
  {
    code: 'doan_tau',
    title: 'Đoàn Tàu Số Học',
    subtitle: 'Tìm số còn thiếu trên toa tàu theo thứ tự dãy số',
    badge: 'Thứ tự & Dãy số',
    iconName: 'TrainTrack',
    themeColor: 'sky',
    defaultTopic: 'D_LIEN_TRUOC_SAU'
  },
  {
    code: 'ca_sau',
    title: 'Cá Sấu Chọn Số',
    subtitle: 'Miệng cá sấu đói há về phía lớn hơn (> < =)',
    badge: 'So sánh số',
    iconName: 'Smile',
    themeColor: 'amber',
    defaultTopic: 'C_SO_SANH'
  },
  {
    code: 'bong_bong',
    title: 'Bong Bóng Phép Tính',
    subtitle: 'Chạm bong bóng chứa kết quả phép cộng, phép trừ đúng',
    badge: 'Phép tính nhanh',
    iconName: 'Sparkles',
    themeColor: 'indigo',
    defaultTopic: 'F_PHEP_CONG'
  },
  {
    code: 'sieu_thi',
    title: 'Siêu Thị Tí Hon',
    subtitle: 'Toán tình huống thêm bớt hàng hóa trên kệ siêu thị',
    badge: 'Toán thực tế',
    iconName: 'ShoppingBag',
    themeColor: 'rose',
    defaultTopic: 'J_TOAN_THUC_TE'
  },
  {
    code: 'tham_tu',
    title: 'Thám Tử Hình Học',
    subtitle: 'Dùng kính lúp tìm và nhận biết các hình phẳng, hình khối',
    badge: 'Hình học trực quan',
    iconName: 'Shapes',
    themeColor: 'purple',
    defaultTopic: 'H_HINH_HOC'
  },
  {
    code: 'ngoi_nha',
    title: 'Ngôi Nhà Tách – Gộp',
    subtitle: 'Tách số mái nhà thành 2 phòng hoặc gộp 2 phòng lên mái',
    badge: 'Tách & Gộp số',
    iconName: 'Home',
    themeColor: 'teal',
    defaultTopic: 'E_TACH_GOP'
  },
  {
    code: 'ghep_doi',
    title: 'Ghép Đôi Thông Minh',
    subtitle: 'Nối các thẻ số với lượng đồ vật hoặc phép tính tương đương',
    badge: 'Tư duy liên kết',
    iconName: 'Layers',
    themeColor: 'cyan',
    defaultTopic: 'I_DO_LUONG'
  }
];

export const ERROR_CLASSIFICATIONS: {
  code: ErrorClassificationCode;
  label: string;
  pedagogicalAction: string;
}[] = [
  {
    code: 'dem_thieu_thua',
    label: 'Đếm thiếu hoặc đếm thừa',
    pedagogicalAction: 'Rèn thao tác vừa chỉ tay vừa đọc số, gạch chân hoặc đánh dấu vật đã đếm.'
  },
  {
    code: 'ghep_so_luong',
    label: 'Ghép số và lượng chưa đúng',
    pedagogicalAction: 'Dùng bộ đồ dùng thực hành gắn từng que tính/chấm tròn với thẻ số.'
  },
  {
    code: 'so_sanh_sai',
    label: 'So sánh số chưa đúng',
    pedagogicalAction: 'Sử dụng trực quan chiều mở miệng cá sấu hướng về bên nhiều hơn.'
  },
  {
    code: 'nham_thu_tu',
    label: 'Nhầm thứ tự số',
    pedagogicalAction: 'Luyện tập đọc xuôi, đọc ngược dãy số và sử dụng tia số minh họa.'
  },
  {
    code: 'sai_phep_cong',
    label: 'Sai kết quả phép cộng',
    pedagogicalAction: 'Tập đếm thêm bắt đầu từ số lớn hơn; thực hành gộp 2 nhóm đồ vật.'
  },
  {
    code: 'sai_phep_tru',
    label: 'Sai kết quả phép trừ',
    pedagogicalAction: 'Tập đếm bớt lùi lại hoặc dùng sơ đồ tách gộp số tương ứng.'
  },
  {
    code: 'chua_nhan_biet_hinh',
    label: 'Chưa nhận biết đúng hình',
    pedagogicalAction: 'Quan sát các vật thể thật xung quanh lớp học (đồng hồ tròn, bảng chữ nhật).'
  },
  {
    code: 'can_nhieu_goi_y',
    label: 'Cần nhiều lần gợi ý',
    pedagogicalAction: 'Tạo trò chơi ở mức Mầm Xanh, tăng cường đồ họa trực quan và giảm phạm vi số.'
  }
];

export const INITIAL_CURRICULUM_LESSONS: CurriculumLesson[] = [
  {
    id: 'les_01',
    week: 1,
    title: 'Các số 1, 2, 3',
    objective: 'Đếm, nhận biết và đọc viết các số 1, 2, 3.',
    topicKey: 'A_DEM_SO',
    numberRange: '0-10',
    taughtDate: '2026-09-08',
    status: 'DA_DAY'
  },
  {
    id: 'les_02',
    week: 2,
    title: 'Các số 4, 5, 6',
    objective: 'Đếm và nhận biết nhóm đồ vật có số lượng 4, 5, 6.',
    topicKey: 'A_DEM_SO',
    numberRange: '0-10',
    taughtDate: '2026-09-15',
    status: 'DA_DAY'
  },
  {
    id: 'les_03',
    week: 3,
    title: 'Nhiều hơn, ít hơn, bằng nhau',
    objective: 'Nhận biết quan hệ so sánh trực quan về số lượng giữa 2 nhóm.',
    topicKey: 'B_NHIEU_IT',
    numberRange: '0-10',
    taughtDate: '2026-09-22',
    status: 'DA_DAY'
  },
  {
    id: 'les_04',
    week: 4,
    title: 'Các số 7, 8, 9, 10 và số 0',
    objective: 'Hoàn thành nhận biết các số trong phạm vi 10.',
    topicKey: 'A_DEM_SO',
    numberRange: '0-10',
    taughtDate: '2026-09-29',
    status: 'DA_DAY'
  },
  {
    id: 'les_05',
    week: 5,
    title: 'So sánh số trong phạm vi 10',
    objective: 'Sử dụng thành thạo các dấu >, <, =.',
    topicKey: 'C_SO_SANH',
    numberRange: '0-10',
    taughtDate: '2026-10-06',
    status: 'DA_DAY'
  },
  {
    id: 'les_06',
    week: 6,
    title: 'Số liền trước, số liền sau trong phạm vi 10',
    objective: 'Biết tìm số liền trước, số liền sau của một số cho trước.',
    topicKey: 'D_LIEN_TRUOC_SAU',
    numberRange: '0-10',
    taughtDate: '2026-10-13',
    status: 'DA_DAY'
  },
  {
    id: 'les_07',
    week: 7,
    title: 'Tách – Gộp số',
    objective: 'Nắm chắc cấu tạo số theo sơ đồ tách gộp.',
    topicKey: 'E_TACH_GOP',
    numberRange: '0-10',
    taughtDate: '2026-10-20',
    status: 'DA_DAY'
  },
  {
    id: 'les_08',
    week: 8,
    title: 'Phép cộng trong phạm vi 10',
    objective: 'Hình thành khái niệm phép cộng và thực hiện phép cộng đơn giản.',
    topicKey: 'F_PHEP_CONG',
    numberRange: '0-10',
    taughtDate: '2026-10-26',
    status: 'DA_DAY'
  },
  {
    id: 'les_09',
    week: 9,
    title: 'Phép trừ trong phạm vi 10',
    objective: 'Hình thành khái niệm phép trừ và giải quyết bài toán bớt đi.',
    topicKey: 'G_PHEP_TRU',
    numberRange: '0-10',
    status: 'CHUA_DAY'
  },
  {
    id: 'les_10',
    week: 10,
    title: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật',
    objective: 'Nhận diện và gọi đúng tên các hình phẳng cơ bản.',
    topicKey: 'H_HINH_HOC',
    numberRange: '0-10',
    status: 'CHUA_DAY'
  }
];

// Curated verified demo questions for all 8 games
export const SAMPLE_APPROVED_GAMES: GameDefinition[] = [
  {
    id: 'demo_game_01',
    title: 'Vườn Táo Nhiệm Màu (Phạm vi 10)',
    topicKey: 'A_DEM_SO',
    lessonTitle: 'Đếm và nhận biết các số trong phạm vi 10',
    learningObjective: 'Học sinh đếm chính xác số lượng quả táo và chọn đúng số',
    numberRange: '0-10',
    gameType: 'vuon_so',
    difficulty: 'VUON_CAO',
    questionCount: 8,
    approvalStatus: 'APPROVED',
    createdAt: '2026-10-20T08:00:00Z',
    isDemo: true,
    questions: [
      {
        id: 'q_demo_1_1',
        gameType: 'vuon_so',
        questionText: 'Trong vườn có mấy quả táo chín đỏ trên cây?',
        visualData: {
          type: 'svg_items',
          items: Array(3).fill(0).map((_, i) => ({ svgType: 'apple', label: `${i + 1}` }))
        },
        options: [2, 3, 4, 5],
        correctAnswer: 3,
        pedagogicalHint: 'Con hãy chạm vào từng quả táo để đếm từ 1 đến hết nhé!',
        explanation: 'Đếm lần lượt: 1, 2, 3. Có tất cả đúng 3 quả táo.'
      },
      {
        id: 'q_demo_1_2',
        gameType: 'vuon_so',
        questionText: 'Trong vườn có mấy ngôi sao lấp lánh?',
        visualData: {
          type: 'svg_items',
          items: Array(5).fill(0).map((_, i) => ({ svgType: 'star', label: `${i + 1}` }))
        },
        options: [4, 5, 6, 7],
        correctAnswer: 5,
        pedagogicalHint: 'Con hãy đếm chậm rãi từng ngôi sao vàng nhé.',
        explanation: 'Có tất cả đúng 5 ngôi sao lấp lánh.'
      },
      {
        id: 'q_demo_1_3',
        gameType: 'vuon_so',
        questionText: 'Có bao nhiêu bông hoa rực rỡ đang nở?',
        visualData: {
          type: 'svg_items',
          items: Array(2).fill(0).map((_, i) => ({ svgType: 'flower', label: `${i + 1}` }))
        },
        options: [1, 2, 3, 4],
        correctAnswer: 2,
        pedagogicalHint: 'Một, hai... có mấy bông hoa con nhỉ?',
        explanation: 'Có tất cả 2 bông hoa đang nở rực rỡ.'
      },
      {
        id: 'q_demo_1_4',
        gameType: 'vuon_so',
        questionText: 'Mấy chú cá đang tung tăng bơi lội dưới nước?',
        visualData: {
          type: 'svg_items',
          items: Array(6).fill(0).map((_, i) => ({ svgType: 'fish', label: `${i + 1}` }))
        },
        options: [5, 6, 7, 8],
        correctAnswer: 6,
        pedagogicalHint: 'Đếm lần lượt từng chú cá từ trái sang phải nào!',
        explanation: 'Có đúng 6 chú cá đang bơi lội.'
      },
      {
        id: 'q_demo_1_5',
        gameType: 'vuon_so',
        questionText: 'Có mấy quả cam mọng nước trên đĩa?',
        visualData: {
          type: 'svg_items',
          items: Array(4).fill(0).map((_, i) => ({ svgType: 'orange', label: `${i + 1}` }))
        },
        options: [3, 4, 5, 6],
        correctAnswer: 4,
        pedagogicalHint: 'Con đếm cùng cô nào: 1, 2, 3, 4 quả cam.',
        explanation: 'Có đúng 4 quả cam mọng nước.'
      },
      {
        id: 'q_demo_1_6',
        gameType: 'vuon_so',
        questionText: 'Bao nhiêu chú bướm xinh xắn đang bay lượn?',
        visualData: {
          type: 'svg_items',
          items: Array(7).fill(0).map((_, i) => ({ svgType: 'butterfly', label: `${i + 1}` }))
        },
        options: [6, 7, 8, 9],
        correctAnswer: 7,
        pedagogicalHint: 'Chỉ tay vào từng cánh bướm và đếm thật chuẩn nhé con.',
        explanation: 'Đúng 7 chú bướm rực rỡ.'
      },
      {
        id: 'q_demo_1_7',
        gameType: 'vuon_so',
        questionText: 'Có bao nhiêu chiếc ô tô đang đỗ trong bãi?',
        visualData: {
          type: 'svg_items',
          items: Array(1).fill(0).map((_, i) => ({ svgType: 'car', label: `${i + 1}` }))
        },
        options: [0, 1, 2, 3],
        correctAnswer: 1,
        pedagogicalHint: 'Chỉ có một chiếc ô tô duy nhất màu đỏ thôi con nhé.',
        explanation: 'Chính xác là 1 chiếc ô tô.'
      },
      {
        id: 'q_demo_1_8',
        gameType: 'vuon_so',
        questionText: 'Có bao nhiêu quả táo thơm ngon?',
        visualData: {
          type: 'svg_items',
          items: Array(8).fill(0).map((_, i) => ({ svgType: 'apple', label: `${i + 1}` }))
        },
        options: [7, 8, 9, 10],
        correctAnswer: 8,
        pedagogicalHint: 'Đếm từ 1 đến 8 nhé con yêu!',
        explanation: 'Có đúng 8 quả táo.'
      }
    ]
  },
  {
    id: 'demo_game_02',
    title: 'Đoàn Tàu Số Học Vui Nhộn',
    topicKey: 'D_LIEN_TRUOC_SAU',
    lessonTitle: 'Số liền trước, số liền sau trong dãy số',
    learningObjective: 'Xác định số liền trước và số liền sau thích hợp điền vào toa tàu',
    numberRange: '0-10',
    gameType: 'doan_tau',
    difficulty: 'VUON_CAO',
    questionCount: 8,
    approvalStatus: 'APPROVED',
    createdAt: '2026-10-21T09:30:00Z',
    isDemo: true,
    questions: [
      {
        id: 'q_demo_2_1',
        gameType: 'doan_tau',
        questionText: 'Toa tàu nào còn thiếu số? Con hãy chọn số đúng cho toa [?]',
        visualData: {
          type: 'train',
          trainCars: [1, 2, null, 4]
        },
        options: [2, 3, 5, 0],
        correctAnswer: 3,
        pedagogicalHint: 'Số nào đứng liền sau số 2 và liền trước số 4?',
        explanation: 'Dãy số liên tiếp là 1, 2, 3, 4. Số cần điền là 3.'
      },
      {
        id: 'q_demo_2_2',
        gameType: 'doan_tau',
        questionText: 'Toa đầu tiên là số mấy? [?], 5, 6, 7',
        visualData: {
          type: 'train',
          trainCars: [null, 5, 6, 7]
        },
        options: [3, 4, 8, 2],
        correctAnswer: 4,
        pedagogicalHint: 'Số liền trước của 5 là số mấy con nhỉ?',
        explanation: 'Số liền trước của 5 là 4.'
      },
      {
        id: 'q_demo_2_3',
        gameType: 'doan_tau',
        questionText: 'Toa cuối cùng là số mấy? 6, 7, 8, [?]',
        visualData: {
          type: 'train',
          trainCars: [6, 7, 8, null]
        },
        options: [7, 9, 10, 5],
        correctAnswer: 9,
        pedagogicalHint: 'Đếm tiếp theo số 8 là số nào con nhỉ?',
        explanation: 'Sau 8 là 9.'
      },
      {
        id: 'q_demo_2_4',
        gameType: 'doan_tau',
        questionText: 'Điền số vào toa bị khuyết: 3, [?], 5, 6',
        visualData: {
          type: 'train',
          trainCars: [3, null, 5, 6]
        },
        options: [2, 4, 7, 1],
        correctAnswer: 4,
        pedagogicalHint: 'Số đứng giữa 3 và 5 là số nào con?',
        explanation: '3 rồi đến 4 rồi đến 5.'
      },
      {
        id: 'q_demo_2_5',
        gameType: 'doan_tau',
        questionText: 'Toa số mấy chạy sau toa 8? 7, 8, [?], 10',
        visualData: {
          type: 'train',
          trainCars: [7, 8, null, 10]
        },
        options: [6, 9, 5, 0],
        correctAnswer: 9,
        pedagogicalHint: 'Số liền sau của 8 là 9 con nhé.',
        explanation: '7, 8, 9, 10.'
      },
      {
        id: 'q_demo_2_6',
        gameType: 'doan_tau',
        questionText: 'Toa dẫn đầu là số mấy? [?], 2, 3, 4',
        visualData: {
          type: 'train',
          trainCars: [null, 2, 3, 4]
        },
        options: [0, 1, 5, 6],
        correctAnswer: 1,
        pedagogicalHint: 'Số bắt đầu của dãy đếm tự nhiên có 2, 3, 4 là số 1.',
        explanation: 'Dãy số bắt đầu bằng số 1.'
      },
      {
        id: 'q_demo_2_7',
        gameType: 'doan_tau',
        questionText: 'Toa cuối đoàn tàu: 2, 3, 4, [?]',
        visualData: {
          type: 'train',
          trainCars: [2, 3, 4, null]
        },
        options: [5, 6, 1, 7],
        correctAnswer: 5,
        pedagogicalHint: 'Đếm tiếp theo 4 là số mấy con?',
        explanation: '2, 3, 4 rồi đến 5.'
      },
      {
        id: 'q_demo_2_8',
        gameType: 'doan_tau',
        questionText: 'Điền số vào toa thứ ba: 4, 5, [?], 7',
        visualData: {
          type: 'train',
          trainCars: [4, 5, null, 7]
        },
        options: [6, 8, 3, 2],
        correctAnswer: 6,
        pedagogicalHint: 'Số đứng giữa 5 và 7 là số 6 nhé con.',
        explanation: '4, 5, 6, 7. Số còn thiếu là 6.'
      }
    ]
  },
  {
    id: 'demo_game_03',
    title: 'Cá Sấu So Sánh Thông Thái',
    topicKey: 'C_SO_SANH',
    lessonTitle: 'So sánh số bằng dấu >, <, =',
    learningObjective: 'Học sinh chọn chính xác dấu so sánh lớn hơn, bé hơn hoặc bằng nhau',
    numberRange: '0-10',
    gameType: 'ca_sau',
    difficulty: 'VUON_CAO',
    questionCount: 8,
    approvalStatus: 'APPROVED',
    createdAt: '2026-10-22T10:15:00Z',
    isDemo: true,
    questions: [
      {
        id: 'q_demo_3_1',
        gameType: 'ca_sau',
        questionText: 'So sánh số lượng táo bên trái và bên phải: 5 ... 3',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 5, svgType: 'apple', label: '5' },
          groupB: { count: 3, svgType: 'apple', label: '3' }
        },
        options: ['>', '<', '='],
        correctAnswer: '>',
        pedagogicalHint: '5 quả táo nhiều hơn 3 quả táo. Miệng cá sấu há to về số 5!',
        explanation: '5 > 3 vì 5 lớn hơn 3.'
      },
      {
        id: 'q_demo_3_2',
        gameType: 'ca_sau',
        questionText: 'So sánh: 4 ... 7',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 4, svgType: 'star', label: '4' },
          groupB: { count: 7, svgType: 'star', label: '7' }
        },
        options: ['>', '<', '='],
        correctAnswer: '<',
        pedagogicalHint: 'Bên phải có 7 ngôi sao nhiều hơn bên trái có 4 ngôi sao.',
        explanation: '4 < 7 vì 4 bé hơn 7.'
      },
      {
        id: 'q_demo_3_3',
        gameType: 'ca_sau',
        questionText: 'So sánh: 6 ... 6',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 6, svgType: 'flower', label: '6' },
          groupB: { count: 6, svgType: 'flower', label: '6' }
        },
        options: ['>', '<', '='],
        correctAnswer: '=',
        pedagogicalHint: 'Hai bên đều có 6 bông hoa bằng nhau con nhé.',
        explanation: '6 = 6 vì hai bên có số lượng bằng nhau.'
      },
      {
        id: 'q_demo_3_4',
        gameType: 'ca_sau',
        questionText: 'So sánh: 9 ... 8',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 9, svgType: 'fish', label: '9' },
          groupB: { count: 8, svgType: 'fish', label: '8' }
        },
        options: ['>', '<', '='],
        correctAnswer: '>',
        pedagogicalHint: '9 chú cá nhiều hơn 8 chú cá.',
        explanation: '9 > 8.'
      },
      {
        id: 'q_demo_3_5',
        gameType: 'ca_sau',
        questionText: 'So sánh: 2 ... 5',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 2, svgType: 'orange', label: '2' },
          groupB: { count: 5, svgType: 'orange', label: '5' }
        },
        options: ['>', '<', '='],
        correctAnswer: '<',
        pedagogicalHint: '2 bé hơn 5 nên miệng cá sấu há về số 5.',
        explanation: '2 < 5.'
      },
      {
        id: 'q_demo_3_6',
        gameType: 'ca_sau',
        questionText: 'So sánh: 10 ... 10',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 10, svgType: 'butterfly', label: '10' },
          groupB: { count: 10, svgType: 'butterfly', label: '10' }
        },
        options: ['>', '<', '='],
        correctAnswer: '=',
        pedagogicalHint: 'Hai bên số lượng như nhau, ta chọn dấu bằng (=).',
        explanation: '10 = 10.'
      },
      {
        id: 'q_demo_3_7',
        gameType: 'ca_sau',
        questionText: 'So sánh: 8 ... 3',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 8, svgType: 'car', label: '8' },
          groupB: { count: 3, svgType: 'car', label: '3' }
        },
        options: ['>', '<', '='],
        correctAnswer: '>',
        pedagogicalHint: '8 chiếc xe nhiều hơn 3 chiếc xe.',
        explanation: '8 > 3.'
      },
      {
        id: 'q_demo_3_8',
        gameType: 'ca_sau',
        questionText: 'So sánh: 1 ... 4',
        visualData: {
          type: 'compare_groups',
          groupA: { count: 1, svgType: 'apple', label: '1' },
          groupB: { count: 4, svgType: 'apple', label: '4' }
        },
        options: ['>', '<', '='],
        correctAnswer: '<',
        pedagogicalHint: '1 bé hơn 4 con nhé.',
        explanation: '1 < 4.'
      }
    ]
  },
  {
    id: 'demo_game_04',
    title: 'Bong Bóng Phép Tính Thần Kỳ',
    topicKey: 'F_PHEP_CONG',
    lessonTitle: 'Phép cộng và phép trừ trong phạm vi 10',
    learningObjective: 'Tính nhẩm nhanh kết quả phép cộng và trừ trong phạm vi 10',
    numberRange: '0-10',
    gameType: 'bong_bong',
    difficulty: 'VUON_CAO',
    questionCount: 8,
    approvalStatus: 'APPROVED',
    createdAt: '2026-10-23T14:20:00Z',
    isDemo: true,
    questions: [
      {
        id: 'q_demo_4_1',
        gameType: 'bong_bong',
        questionText: 'Tính: 3 + 2 = ?',
        visualData: { type: 'bubbles', items: [{ label: '3 + 2' }] },
        options: [4, 5, 6, 7],
        correctAnswer: 5,
        pedagogicalHint: 'Có 3, con đếm thêm 2 nữa: 4, 5.',
        explanation: '3 + 2 = 5.'
      },
      {
        id: 'q_demo_4_2',
        gameType: 'bong_bong',
        questionText: 'Tính: 5 - 2 = ?',
        visualData: { type: 'bubbles', items: [{ label: '5 - 2' }] },
        options: [2, 3, 4, 1],
        correctAnswer: 3,
        pedagogicalHint: 'Có 5 quả bóng, bớt đi 2 quả, còn lại mấy quả?',
        explanation: '5 - 2 = 3.'
      },
      {
        id: 'q_demo_4_3',
        gameType: 'bong_bong',
        questionText: 'Tính: 4 + 4 = ?',
        visualData: { type: 'bubbles', items: [{ label: '4 + 4' }] },
        options: [7, 8, 9, 6],
        correctAnswer: 8,
        pedagogicalHint: 'Gộp 4 và 4 được mấy con nhỉ?',
        explanation: '4 + 4 = 8.'
      },
      {
        id: 'q_demo_4_4',
        gameType: 'bong_bong',
        questionText: 'Tính: 7 - 3 = ?',
        visualData: { type: 'bubbles', items: [{ label: '7 - 3' }] },
        options: [3, 4, 5, 2],
        correctAnswer: 4,
        pedagogicalHint: 'Đếm lùi 3 bước từ 7: 6, 5, 4.',
        explanation: '7 - 3 = 4.'
      },
      {
        id: 'q_demo_4_5',
        gameType: 'bong_bong',
        questionText: 'Tính: 6 + 3 = ?',
        visualData: { type: 'bubbles', items: [{ label: '6 + 3' }] },
        options: [8, 9, 10, 7],
        correctAnswer: 9,
        pedagogicalHint: '6 đếm thêm 3: 7, 8, 9.',
        explanation: '6 + 3 = 9.'
      },
      {
        id: 'q_demo_4_6',
        gameType: 'bong_bong',
        questionText: 'Tính: 8 - 4 = ?',
        visualData: { type: 'bubbles', items: [{ label: '8 - 4' }] },
        options: [3, 4, 5, 6],
        correctAnswer: 4,
        pedagogicalHint: '8 gồm 4 và mấy con nhỉ?',
        explanation: '8 - 4 = 4.'
      },
      {
        id: 'q_demo_4_7',
        gameType: 'bong_bong',
        questionText: 'Tính: 2 + 5 = ?',
        visualData: { type: 'bubbles', items: [{ label: '2 + 5' }] },
        options: [6, 7, 8, 9],
        correctAnswer: 7,
        pedagogicalHint: 'Lấy số lớn hơn là 5 đếm thêm 2: 6, 7.',
        explanation: '2 + 5 = 7.'
      },
      {
        id: 'q_demo_4_8',
        gameType: 'bong_bong',
        questionText: 'Tính: 10 - 5 = ?',
        visualData: { type: 'bubbles', items: [{ label: '10 - 5' }] },
        options: [4, 5, 6, 7],
        correctAnswer: 5,
        pedagogicalHint: '10 ngón tay cụp 5 ngón, còn lại mấy ngón?',
        explanation: '10 - 5 = 5.'
      }
    ]
  }
];

// Assessment questions for Version A and Version B (equivalent, no exact repeats)
export const ASSESSMENT_SURVEY_A: MathQuestion[] = [
  {
    id: 'as_a_1',
    gameType: 'vuon_so',
    questionText: 'Đề A - Câu 1: Đếm số lượng quả táo chín trong vườn:',
    visualData: {
      type: 'svg_items',
      items: Array(4).fill(0).map((_, i) => ({ svgType: 'apple', label: `${i + 1}` }))
    },
    options: [3, 4, 5, 6],
    correctAnswer: 4,
    pedagogicalHint: 'Chỉ tay vào từng quả và đếm từ 1 đến hết.',
    explanation: 'Có đúng 4 quả táo.'
  },
  {
    id: 'as_a_2',
    gameType: 'ca_sau',
    questionText: 'Đề A - Câu 2: Điền dấu thích hợp: 6 ... 4',
    visualData: {
      type: 'compare_groups',
      groupA: { count: 6, svgType: 'flower' },
      groupB: { count: 4, svgType: 'flower' }
    },
    options: ['>', '<', '='],
    correctAnswer: '>',
    pedagogicalHint: '6 bông hoa nhiều hơn 4 bông hoa.',
    explanation: '6 > 4.'
  },
  {
    id: 'as_a_3',
    gameType: 'doan_tau',
    questionText: 'Đề A - Câu 3: Điền số còn thiếu vào toa tàu: 5, 6, [?], 8',
    visualData: {
      type: 'train',
      trainCars: [5, 6, null, 8]
    },
    options: [7, 9, 4, 3],
    correctAnswer: 7,
    pedagogicalHint: 'Số đứng giữa 6 và 8 là số mấy?',
    explanation: 'Số còn thiếu là 7.'
  },
  {
    id: 'as_a_4',
    gameType: 'ngoi_nha',
    questionText: 'Đề A - Câu 4: Tách gộp số: Mái nhà số 5, phòng trái có 3, phòng phải có mấy?',
    visualData: {
      type: 'number_house',
      houseTop: 5,
      houseLeft: 3,
      houseRight: null
    },
    options: [1, 2, 3, 4],
    correctAnswer: 2,
    pedagogicalHint: '5 gồm 3 và mấy?',
    explanation: '5 gồm 3 và 2.'
  },
  {
    id: 'as_a_5',
    gameType: 'bong_bong',
    questionText: 'Đề A - Câu 5: Kết quả của phép tính: 4 + 3 = ?',
    visualData: { type: 'bubbles', items: [{ label: '4 + 3' }] },
    options: [6, 7, 8, 9],
    correctAnswer: 7,
    pedagogicalHint: '4 đếm thêm 3 nữa được mấy?',
    explanation: '4 + 3 = 7.'
  }
];

export const ASSESSMENT_SURVEY_B: MathQuestion[] = [
  {
    id: 'as_b_1',
    gameType: 'vuon_so',
    questionText: 'Đề B - Câu 1: Đếm số lượng ngôi sao lấp lánh:',
    visualData: {
      type: 'svg_items',
      items: Array(5).fill(0).map((_, i) => ({ svgType: 'star', label: `${i + 1}` }))
    },
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    pedagogicalHint: 'Chỉ tay vào từng ngôi sao và đếm lần lượt.',
    explanation: 'Có đúng 5 ngôi sao.'
  },
  {
    id: 'as_b_2',
    gameType: 'ca_sau',
    questionText: 'Đề B - Câu 2: Điền dấu thích hợp: 3 ... 5',
    visualData: {
      type: 'compare_groups',
      groupA: { count: 3, svgType: 'star' },
      groupB: { count: 5, svgType: 'star' }
    },
    options: ['>', '<', '='],
    correctAnswer: '<',
    pedagogicalHint: '3 ngôi sao ít hơn 5 ngôi sao.',
    explanation: '3 < 5.'
  },
  {
    id: 'as_b_3',
    gameType: 'doan_tau',
    questionText: 'Đề B - Câu 3: Điền số còn thiếu vào toa tàu: 2, [?], 4, 5',
    visualData: {
      type: 'train',
      trainCars: [2, null, 4, 5]
    },
    options: [1, 3, 6, 7],
    correctAnswer: 3,
    pedagogicalHint: 'Số đứng giữa 2 và 4 là số mấy?',
    explanation: 'Số còn thiếu là 3.'
  },
  {
    id: 'as_b_4',
    gameType: 'ngoi_nha',
    questionText: 'Đề B - Câu 4: Tách gộp số: Mái nhà số 6, phòng trái có 4, phòng phải có mấy?',
    visualData: {
      type: 'number_house',
      houseTop: 6,
      houseLeft: 4,
      houseRight: null
    },
    options: [1, 2, 3, 5],
    correctAnswer: 2,
    pedagogicalHint: '6 gồm 4 và mấy?',
    explanation: '6 gồm 4 và 2.'
  },
  {
    id: 'as_b_5',
    gameType: 'bong_bong',
    questionText: 'Đề B - Câu 5: Kết quả của phép tính: 5 + 2 = ?',
    visualData: { type: 'bubbles', items: [{ label: '5 + 2' }] },
    options: [6, 7, 8, 9],
    correctAnswer: 7,
    pedagogicalHint: '5 đếm thêm 2 nữa được mấy?',
    explanation: '5 + 2 = 7.'
  }
];
