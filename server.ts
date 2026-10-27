import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as instructed by guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Verification function for Grade 1 math
function verifyMathItem(item: any, numberRange: string): { valid: boolean; reason?: string } {
  const maxNum = numberRange === '0-100' ? 100 : numberRange === '0-20' ? 20 : 10;
  
  // Verify correct answer is within range
  const numAns = Number(item.correctAnswer);
  if (!isNaN(numAns) && (numAns < 0 || numAns > maxNum)) {
    return { valid: false, reason: `Đáp án ${numAns} vượt quá phạm vi số ${numberRange}` };
  }

  // Verify options uniqueness
  const strOptions = item.options.map((o: any) => String(o).trim());
  const uniqueOptions = new Set(strOptions);
  if (uniqueOptions.size !== strOptions.length) {
    return { valid: false, reason: 'Có phương án lựa chọn bị trùng lặp' };
  }

  // Verify correct answer is in options
  if (!uniqueOptions.has(String(item.correctAnswer).trim())) {
    return { valid: false, reason: 'Đáp án đúng không nằm trong danh sách lựa chọn' };
  }

  return { valid: true };
}

// Fallback high-quality generator conforming to Vietnamese Grade 1 GDPT 2018
function generatePedagogicalFallback(topic: string, gameType: string, numberRange: string, count: number) {
  const max = numberRange === '0-100' ? 100 : numberRange === '0-20' ? 20 : 10;
  const questions: any[] = [];
  const svgTypes = ['apple', 'star', 'orange', 'flower', 'butterfly', 'car', 'fish'];

  for (let i = 0; i < count; i++) {
    const qId = `q_fb_${Date.now()}_${i}`;
    if (gameType === 'vuon_so') {
      const targetCount = Math.max(1, Math.min(max, (i % max) + 1));
      const shape = svgTypes[i % svgTypes.length];
      const opts = Array.from(new Set([targetCount, Math.max(0, targetCount - 1), Math.min(max, targetCount + 1), Math.min(max, targetCount + 2)]))
        .filter(n => n >= 0 && n <= max).slice(0, 4);
      while (opts.length < 3) opts.push((targetCount + opts.length) % (max + 1));

      questions.push({
        id: qId,
        gameType: 'vuon_so',
        questionText: `Con hãy đếm xem trong vườn có bao nhiêu quả/hình vẽ?`,
        visualData: {
          type: 'svg_items',
          items: Array(targetCount).fill(0).map((_, idx) => ({ svgType: shape, label: `${idx + 1}` }))
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: targetCount,
        pedagogicalHint: `Con hãy chỉ tay vào từng hình vẽ và đếm lần lượt từ 1 đến hết nhé!`,
        explanation: `Đếm lần lượt từng hình, có tất cả đúng ${targetCount} hình.`
      });
    } else if (gameType === 'ca_sau') {
      const a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      if (i % 3 === 0) b = a;
      const expected = a > b ? '>' : a < b ? '<' : '=';
      const shape = svgTypes[i % svgTypes.length];

      questions.push({
        id: qId,
        gameType: 'ca_sau',
        questionText: `So sánh hai nhóm số hoặc đồ vật: ${a} ... ${b}`,
        visualData: {
          type: 'compare_groups',
          groupA: { count: a, svgType: shape, label: `${a}` },
          groupB: { count: b, svgType: shape, label: `${b}` }
        },
        options: ['>', '<', '='],
        correctAnswer: expected,
        pedagogicalHint: `Chú cá sấu đói bụng luôn há miệng to về phía bên có số lượng nhiều hơn đó con!`,
        explanation: `${a} ${expected} ${b} vì bên ${a > b ? 'trái có ' + a : a < b ? 'phải có ' + b : 'hai bên đều là ' + a} đồ vật.`
      });
    } else if (gameType === 'doan_tau') {
      const start = Math.floor(Math.random() * Math.max(1, max - 4)) + 1;
      const blankIndex = Math.floor(Math.random() * 4);
      const trainCars: (number | null)[] = [start, start + 1, start + 2, start + 3];
      const ans = trainCars[blankIndex] as number;
      trainCars[blankIndex] = null;
      
      const opts = Array.from(new Set([ans, Math.max(0, ans - 1), Math.min(max, ans + 1), Math.min(max, ans + 2)]))
        .filter(n => n >= 0 && n <= max).slice(0, 4);

      questions.push({
        id: qId,
        gameType: 'doan_tau',
        questionText: `Toa tàu nào còn thiếu số? Con hãy chọn số thích hợp để điền vào toa tàu có dấu hỏi chấm [?]`,
        visualData: {
          type: 'train',
          trainCars
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: ans,
        pedagogicalHint: `Con hãy đọc dãy số từ trái sang phải theo thứ tự tăng dần nhé.`,
        explanation: `Dãy số liên tiếp là ${start}, ${start + 1}, ${start + 2}, ${start + 3}. Toa còn thiếu số ${ans}.`
      });
    } else if (gameType === 'bong_bong') {
      const isAdd = i % 2 === 0;
      let a = Math.floor(Math.random() * Math.floor(max / 2)) + 1;
      let b = Math.floor(Math.random() * Math.floor(max / 2)) + 1;
      if (!isAdd) {
        if (a < b) [a, b] = [b, a];
      }
      const ans = isAdd ? a + b : a - b;
      const opts = Array.from(new Set([ans, Math.max(0, ans - 1), Math.min(max, ans + 1), Math.min(max, ans + 2)]))
        .filter(n => n >= 0 && n <= max).slice(0, 4);

      questions.push({
        id: qId,
        gameType: 'bong_bong',
        questionText: `Tính nhanh: ${a} ${isAdd ? '+' : '-'} ${b} = ?`,
        visualData: {
          type: 'bubbles',
          items: [{ label: `${a} ${isAdd ? '+' : '-'} ${b}` }]
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: ans,
        pedagogicalHint: isAdd ? `Thêm vào ta làm phép tính cộng nhé.` : `Bớt đi ta làm phép tính trừ nhé.`,
        explanation: `Kết quả đúng của phép tính ${a} ${isAdd ? '+' : '-'} ${b} là ${ans}.`
      });
    } else if (gameType === 'ngoi_nha') {
      const top = Math.min(max, Math.max(2, (i % (max - 1)) + 2));
      const left = Math.floor(Math.random() * (top - 1)) + 1;
      const right = top - left;

      const opts = Array.from(new Set([right, Math.max(0, right - 1), Math.min(max, right + 1), Math.min(max, right + 2)]))
        .filter(n => n >= 0 && n <= max).slice(0, 4);

      questions.push({
        id: qId,
        gameType: 'ngoi_nha',
        questionText: `Tách - gộp số: Mái nhà có số ${top}, phòng bên trái có ${left}. Hỏi phòng bên phải là số mấy?`,
        visualData: {
          type: 'number_house',
          houseTop: top,
          houseLeft: left,
          houseRight: null
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: right,
        pedagogicalHint: `${top} gồm ${left} và mấy? Con hãy đếm thêm từ ${left} đến ${top} xem thiếu mấy nhé!`,
        explanation: `${top} gồm ${left} và ${right}. Hoặc gộp ${left} và ${right} được ${top}.`
      });
    } else if (gameType === 'tham_tu') {
      const shapes = [
        { name: 'Hình tròn', type: 'circle' },
        { name: 'Hình tam giác', type: 'triangle' },
        { name: 'Hình vuông', type: 'square' },
        { name: 'Hình chữ nhật', type: 'rectangle' }
      ];
      const target = shapes[i % shapes.length];
      const opts = shapes.map(s => s.name);

      questions.push({
        id: qId,
        gameType: 'tham_tu',
        questionText: `Con hãy quan sát hình vẽ và cho biết đây là hình gì?`,
        visualData: {
          type: 'shapes',
          shapeName: target.name,
          shapeType: target.type
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: target.name,
        pedagogicalHint: `Hình tròn có đường cong khép kín, hình tam giác có 3 cạnh, hình vuông có 4 cạnh bằng nhau!`,
        explanation: `Hình đang hiển thị chính xác là ${target.name}.`
      });
    } else if (gameType === 'sieu_thi') {
      const isAdd = i % 2 === 0;
      const initial = Math.floor(Math.random() * 4) + 2;
      const delta = Math.floor(Math.random() * 3) + 1;
      const ans = isAdd ? initial + delta : Math.max(1, initial - delta);
      const actualDelta = isAdd ? delta : initial - ans;
      
      const opts = Array.from(new Set([ans, Math.max(0, ans - 1), Math.min(max, ans + 1), Math.min(max, ans + 2)]))
        .filter(n => n >= 0 && n <= max).slice(0, 4);

      questions.push({
        id: qId,
        gameType: 'sieu_thi',
        questionText: isAdd 
          ? `Mẹ mua ${initial} quả táo, sau đó mua thêm ${actualDelta} quả nữa. Hỏi mẹ có tất cả bao nhiêu quả táo?`
          : `Trong rổ có ${initial} quả cam, bé ăn hết ${actualDelta} quả. Hỏi trong rổ còn lại bao nhiêu quả cam?`,
        visualData: {
          type: 'market_shelf',
          targetShelfItems: {
            name: isAdd ? 'quả táo' : 'quả cam',
            count: initial,
            change: actualDelta,
            type: isAdd ? 'add' : 'remove'
          }
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: ans,
        pedagogicalHint: isAdd ? `Thêm quả táo vào rổ nghĩa là thực hiện phép tính cộng đó con.` : `Bớt quả đi nghĩa là thực hiện phép tính trừ con nhé.`,
        explanation: isAdd ? `${initial} + ${actualDelta} = ${ans}` : `${initial} - ${actualDelta} = ${ans}`
      });
    } else {
      // ghep_doi
      const num = (i % max) + 1;
      const shape = svgTypes[i % svgTypes.length];
      const opts = Array.from(new Set([num, Math.max(0, num - 1), Math.min(max, num + 1), Math.min(max, num + 2)]))
        .filter(n => n >= 0 && n <= max).slice(0, 4);

      questions.push({
        id: qId,
        gameType: 'ghep_doi',
        questionText: `Tìm số tương ứng với nhóm đồ vật có ${num} hình vẽ:`,
        visualData: {
          type: 'svg_items',
          items: Array(num).fill(0).map((_, idx) => ({ svgType: shape, label: `${idx + 1}` }))
        },
        options: opts.sort(() => Math.random() - 0.5),
        correctAnswer: num,
        pedagogicalHint: `Đếm kỹ từng hình một rồi chọn thẻ số giống với số con vừa đếm nhé!`,
        explanation: `Nhóm có ${num} hình nên thẻ số tương ứng là số ${num}.`
      });
    }
  }
  return questions;
}

// Server API: Generate Game via Gemini with mathematical verification
app.post('/api/gemini/generate-game', async (req: Request, res: Response) => {
  const {
    topic,
    lessonTitle,
    learningObjective,
    numberRange = '0-10',
    gameType = 'vuon_so',
    questionCount = 8,
    difficulty = 'VUON_CAO'
  } = req.body;

  // Strict privacy validation: ensure no PII or student identification is passed
  if (req.body.studentName || req.body.studentId || req.body.studentCode) {
    return res.status(400).json({
      error: 'Quy tắc an toàn bảo mật: Tuyệt đối không gửi thông tin cá nhân học sinh khi sử dụng AI.'
    });
  }

  const requestedCount = Math.max(7, Math.min(10, Number(questionCount) || 8));

  // If no Gemini API key configured, use fallback generator
  if (!process.env.GEMINI_API_KEY) {
    const fallbackQuestions = generatePedagogicalFallback(topic, gameType, numberRange, requestedCount);
    return res.json({
      success: true,
      source: 'fallback_engine',
      notice: 'Hệ thống đã tạo bộ câu hỏi theo chuẩn sư phạm GDPT 2018 (Chờ giáo viên duyệt).',
      game: {
        id: `game_${Date.now()}`,
        title: `Trò chơi Toán 1: ${lessonTitle || 'Luyện tập tương tác'}`,
        topic,
        lessonTitle,
        learningObjective,
        numberRange,
        gameType,
        difficulty,
        questionCount: fallbackQuestions.length,
        approvalStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        questions: fallbackQuestions
      }
    });
  }

  try {
    const prompt = `
Bạn là chuyên gia sư phạm môn Toán lớp 1 của Việt Nam theo Chương trình GDPT 2018.
Hãy tạo một bộ câu hỏi tương tác trò chơi Toán lớp 1 với các yêu cầu sư phạm nghiêm ngặt:

1. THÔNG TIN BÀI HỌC:
- Tên bài: "${lessonTitle || 'Bài học Toán 1'}"
- Mục tiêu cần đạt: "${learningObjective || 'Củng cố kiến thức theo chuẩn GDPT 2018'}"
- Chủ đề Toán: "${topic}"
- Kiểu trò chơi: "${gameType}"
- Phạm vi số: ${numberRange} (tuyệt đối chỉ dùng các số trong phạm vi này, không vượt quá)
- Mức độ: ${difficulty} (MẦM XANH: cơ bản nhận biết; VƯƠN CAO: kết nối vận dụng; TỎA SÁNG: thử thách tư duy)
- Số câu cần tạo: đúng ${requestedCount} câu hỏi khác nhau hoàn toàn.

2. QUY TẮC TOÁN HỌC BẮT BUỘC (KIỂM TRA CHÍNH XÁC):
- 100% tiếng Việt chuẩn sư phạm, câu từ trong sáng, ngắn gọn, phù hợp học sinh 6 tuổi mới vào lớp 1.
- Không sinh phép nhân, phép chia, phân số hay số âm.
- Phép trừ không có hiệu âm.
- Mỗi câu hỏi có đúng 4 phương án lựa chọn, không có phương án nào bị trùng lặp.
- Đúng duy nhất một đáp án chính xác.
- Câu hỏi trong cùng một bộ KHÔNG được trùng nhau.
- Cung cấp "pedagogicalHint" (lời gợi ý sư phạm dịu dàng, khích lệ) và "explanation" (giải thích ngắn gọn vì sao đúng).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia toán học tiểu học Việt Nam. Hãy trả về JSON có cấu trúc hoàn chỉnh theo đúng schema yêu cầu.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  pedagogicalHint: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  visualCount: { type: Type.INTEGER, description: 'Số lượng đồ vật cần vẽ nếu là bài đếm' },
                  svgType: { type: Type.STRING, description: 'Tên vật: apple, star, flower, car, orange, butterfly, fish' },
                  shapeType: { type: Type.STRING, description: 'Tên hình học nếu có: circle, square, triangle, rectangle' }
                },
                required: ['questionText', 'options', 'correctAnswer', 'pedagogicalHint', 'explanation']
              }
            }
          },
          required: ['title', 'questions']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const rawQuestions = parsed.questions || [];

    // Run programmatic math validation suite on every generated question
    const validatedQuestions: any[] = [];
    for (let idx = 0; idx < rawQuestions.length; idx++) {
      const q = rawQuestions[idx];
      const verification = verifyMathItem(q, numberRange);
      if (!verification.valid) {
        console.warn(`Math validation warning on item ${idx}: ${verification.reason}`);
        // If invalid, fall back to programmatic safe item for this slot
        const safeFallback = generatePedagogicalFallback(topic, gameType, numberRange, 1)[0];
        safeFallback.id = `q_val_${Date.now()}_${idx}`;
        safeFallback.questionText = q.questionText || safeFallback.questionText;
        validatedQuestions.push(safeFallback);
      } else {
        const shape = q.svgType || 'apple';
        const count = Math.min(numberRange === '0-100' ? 100 : numberRange === '0-20' ? 20 : 10, Math.max(1, q.visualCount || Number(q.correctAnswer) || 3));
        
        validatedQuestions.push({
          id: `q_ai_${Date.now()}_${idx}`,
          gameType,
          questionText: q.questionText,
          visualData: {
            type: gameType === 'tham_tu' ? 'shapes' : 'svg_items',
            items: Array(count).fill(0).map((_, i) => ({ svgType: shape, label: `${i + 1}` })),
            shapeName: q.correctAnswer,
            shapeType: q.shapeType || 'circle'
          },
          options: q.options,
          correctAnswer: q.correctAnswer,
          pedagogicalHint: q.pedagogicalHint || 'Con hãy đọc kỹ và đếm thật cẩn thận nhé!',
          explanation: q.explanation || 'Con đã tính toán rất chuẩn xác.'
        });
      }
    }

    // Ensure we meet requestedCount
    while (validatedQuestions.length < requestedCount) {
      const extra = generatePedagogicalFallback(topic, gameType, numberRange, 1)[0];
      extra.id = `q_extra_${Date.now()}_${validatedQuestions.length}`;
      validatedQuestions.push(extra);
    }

    return res.json({
      success: true,
      source: 'gemini_3.8_flash',
      game: {
        id: `game_${Date.now()}`,
        title: parsed.title || `Trò chơi Toán 1: ${lessonTitle}`,
        topic,
        lessonTitle,
        learningObjective,
        numberRange,
        gameType,
        difficulty,
        questionCount: validatedQuestions.length,
        approvalStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        questions: validatedQuestions.slice(0, requestedCount)
      }
    });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    // On any error, return verified pedagogical fallback
    const fallbackQuestions = generatePedagogicalFallback(topic, gameType, numberRange, requestedCount);
    return res.json({
      success: true,
      source: 'fallback_engine_on_error',
      notice: 'Đã tạo bộ câu hỏi theo thuật toán sư phạm GDPT 2018 (Chờ giáo viên duyệt).',
      game: {
        id: `game_${Date.now()}`,
        title: `Trò chơi Toán 1: ${lessonTitle || 'Luyện tập tương tác'}`,
        topic,
        lessonTitle,
        learningObjective,
        numberRange,
        gameType,
        difficulty,
        questionCount: fallbackQuestions.length,
        approvalStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        questions: fallbackQuestions
      }
    });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), app: 'Toán Khởi Đầu AI' });
});

// Serve Vite dev server or production static assets
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
