import { GameDefinition } from '../types/math';

export function generateStandaloneHtml5(game: GameDefinition): string {
  const gameJson = JSON.stringify(game);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${game.title} - Toán Khởi Đầu AI (Góc Toán Vui 1A3)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    body { background: linear-gradient(135deg, #EFF6FF 0%, #ECFDF5 50%, #FEF3C7 100%); min-height: 100vh; display: flex; flex-direction: column; color: #1E293B; }
    header { background: #FFFFFF; border-bottom: 2px solid #E2E8F0; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.2rem; color: #0284C7; }
    .badge { background: #E0F2FE; color: #0369A1; padding: 4px 10px; border-radius: 999px; font-size: 0.85rem; font-weight: bold; }
    .container { max-width: 800px; width: 100%; margin: 20px auto; padding: 0 16px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .card { background: #FFFFFF; border-radius: 28px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); border: 3px solid #BAE6FD; padding: 24px; text-align: center; }
    .progress-bar-bg { width: 100%; height: 16px; background: #E2E8F0; border-radius: 999px; overflow: hidden; margin-bottom: 16px; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #10B981, #06B6D4); transition: width 0.3s ease; }
    .question-title { font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-bottom: 20px; line-height: 1.4; }
    .visual-stage { background: #F8FAFC; border-radius: 20px; border: 2px dashed #93C5FD; min-height: 160px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; padding: 20px; margin-bottom: 24px; }
    .options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
    @media(min-width: 600px) { .options-grid { grid-template-columns: repeat(4, 1fr); } }
    .opt-btn { background: #F0FDF4; border: 3px solid #86EFAC; border-radius: 20px; padding: 18px 12px; font-size: 1.6rem; font-weight: 800; color: #166534; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .opt-btn:hover { background: #DCFCE7; transform: translateY(-2px); border-color: #22C55E; }
    .opt-btn:active { transform: translateY(1px); }
    .feedback-box { margin-top: 16px; padding: 14px 20px; border-radius: 16px; font-weight: bold; font-size: 1.15rem; }
    .feedback-success { background: #DCFCE7; color: #15803D; border: 2px solid #86EFAC; }
    .feedback-retry { background: #FEF3C7; color: #B45309; border: 2px solid #FCD34D; }
    .hint-text { margin-top: 8px; font-size: 0.98rem; color: #78350F; font-weight: normal; }
    .action-btn { background: #0284C7; color: #FFFFFF; font-size: 1.2rem; font-weight: bold; padding: 12px 28px; border-radius: 999px; border: none; cursor: pointer; margin-top: 14px; }
    .action-btn:hover { background: #0369A1; }
    .voice-btn { background: #E0E7FF; color: #4338CA; border: none; border-radius: 999px; padding: 6px 14px; font-size: 0.9rem; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 12px; }
    .item-icon { width: 52px; height: 52px; display: inline-block; cursor: pointer; transition: transform 0.15s ease; }
    .item-icon:hover { transform: scale(1.15); }
    .star-trophy { font-size: 3rem; margin-bottom: 12px; }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span>⭐ TOÁN KHỞI ĐẦU AI</span>
      <span class="badge">Lớp 1A3</span>
    </div>
    <div id="student-tag" class="badge">Học sinh tự do</div>
  </header>

  <div class="container">
    <!-- Screen 1: Start Screen -->
    <div id="start-screen" class="card">
      <div class="star-trophy">🌟 🍎 🚂</div>
      <h1 style="font-size: 1.8rem; font-weight: 800; color: #0369A1; margin-bottom: 8px;">${game.title}</h1>
      <p style="color: #64748B; margin-bottom: 20px; font-size: 1.05rem;">Chạm số – Hiểu nhanh – Học vui</p>
      
      <div style="background: #F8FAFC; border-radius: 16px; padding: 16px; margin-bottom: 24px; text-align: left; max-width: 420px; margin-left: auto; margin-right: auto;">
        <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #334155;">Nhập mã học sinh của con (ví dụ: H01, H02):</label>
        <input id="input-student-code" type="text" placeholder="H01" value="H01" style="width: 100%; padding: 10px 14px; border: 2px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; font-weight: bold; color: #0F172A;" />
      </div>

      <button id="btn-start" class="action-btn" style="padding: 16px 40px; font-size: 1.35rem; background: #10B981;">BẮT ĐẦU CHƠI 🚀</button>
    </div>

    <!-- Screen 2: Game Playing Screen -->
    <div id="game-screen" class="card hidden">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span id="question-progress" style="font-weight: 800; color: #0284C7; font-size: 1.1rem;">Câu 1 / ${game.questions.length}</span>
        <button id="btn-read-aloud" class="voice-btn">🔊 Đọc câu hỏi</button>
      </div>
      <div class="progress-bar-bg">
        <div id="progress-fill" class="progress-bar-fill" style="width: 10%;"></div>
      </div>

      <h2 id="q-text" class="question-title"></h2>

      <div id="q-stage" class="visual-stage"></div>

      <div id="q-options" class="options-grid"></div>

      <div id="feedback-area" class="feedback-box hidden"></div>

      <button id="btn-next" class="action-btn hidden">Câu tiếp theo ➔</button>
    </div>

    <!-- Screen 3: Results Summary -->
    <div id="result-screen" class="card hidden">
      <div class="star-trophy">🎉 🏆 🌟</div>
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #047857; margin-bottom: 12px;">CHÚC MỪNG CON ĐÃ HOÀN THÀNH!</h2>
      <p id="summary-text" style="font-size: 1.25rem; font-weight: 600; color: #1E293B; margin-bottom: 20px;"></p>

      <div style="background: #F0FDF4; border: 2px solid #BBF7D0; border-radius: 16px; padding: 18px; max-width: 460px; margin: 0 auto 24px;">
        <div style="font-size: 1.1rem; margin-bottom: 8px;">Số câu trả lời đúng: <strong id="res-correct" style="color: #15803D;"></strong></div>
        <div style="font-size: 1.1rem; margin-bottom: 8px;">Tổng số lần thử: <strong id="res-attempts"></strong></div>
        <div style="font-size: 1.1rem;">Số lần xem gợi ý: <strong id="res-hints"></strong></div>
      </div>

      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <button id="btn-export-result" class="action-btn" style="background: #0284C7;">📥 Xuất kết quả gửi Cô</button>
        <button id="btn-replay" class="action-btn" style="background: #10B981;">🔄 Chơi lại lần nữa</button>
      </div>
    </div>
  </div>

  <footer style="text-align: center; padding: 16px; font-size: 0.85rem; color: #64748B;">
    Toán Khởi Đầu AI • Lớp 1A3 • Trường Tiểu học Hiển Khánh • Năm học 2026–2027
  </footer>

  <script>
    const GAME_DATA = ${gameJson};
    let currentIndex = 0;
    let studentCode = 'H01';
    let correctCount = 0;
    let totalAttempts = 0;
    let hintsUsed = 0;
    let currentQuestionAttempts = 0;
    const sessionAnswers = [];

    // Web Audio Synthesizer
    const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
    function playDing(isGood) {
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      if (isGood) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.42);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(392, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.32);
      }
    }

    function speakVietnamese(text) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'vi-VN';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }

    // SVG graphics map
    function renderSvgItem(type) {
      if (type === 'apple') {
        return '<svg viewBox="0 0 64 64" class="item-icon"><path d="M32 14 C34 8, 38 4, 42 4" stroke="#5D4037" stroke-width="3" fill="none"/><path d="M34 10 C38 8, 44 10, 44 14 Z" fill="#4CAF50"/><path d="M22 16 C12 16, 6 26, 6 38 C6 50, 16 60, 26 60 C30 60, 31 58, 32 58 C33 58, 34 60, 38 60 C48 60, 58 50, 58 38 C58 26, 52 16, 42 16 Z" fill="#EF4444"/></svg>';
      } else if (type === 'star') {
        return '<svg viewBox="0 0 64 64" class="item-icon"><polygon points="32,4 40,22 60,24 45,38 49,58 32,47 15,58 19,38 4,24 24,22" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/><circle cx="26" cy="30" r="2.5" fill="#78350F"/><circle cx="38" cy="30" r="2.5" fill="#78350F"/></svg>';
      } else if (type === 'flower') {
        return '<svg viewBox="0 0 64 64" class="item-icon"><circle cx="32" cy="18" r="10" fill="#F472B6"/><circle cx="46" cy="32" r="10" fill="#F472B6"/><circle cx="32" cy="46" r="10" fill="#F472B6"/><circle cx="18" cy="32" r="10" fill="#F472B6"/><circle cx="32" cy="32" r="10" fill="#FDE047"/></svg>';
      } else if (type === 'fish') {
        return '<svg viewBox="0 0 64 64" class="item-icon"><polygon points="56,22 56,42 42,32" fill="#38BDF8"/><ellipse cx="28" cy="32" rx="20" ry="14" fill="#0EA5E9"/><circle cx="16" cy="28" r="3" fill="#FFFFFF"/><circle cx="15" cy="28" r="1.5" fill="#0F172A"/></svg>';
      } else {
        return '<svg viewBox="0 0 64 64" class="item-icon"><circle cx="32" cy="36" r="22" fill="#F97316"/><path d="M34 10 C38 8, 44 11, 43 14 Z" fill="#22C55E"/></svg>';
      }
    }

    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const inputStudentCode = document.getElementById('input-student-code');
    const studentTag = document.getElementById('student-tag');
    const qProgress = document.getElementById('question-progress');
    const progressFill = document.getElementById('progress-fill');
    const qText = document.getElementById('q-text');
    const qStage = document.getElementById('q-stage');
    const qOptions = document.getElementById('q-options');
    const feedbackArea = document.getElementById('feedback-area');
    const btnNext = document.getElementById('btn-next');
    const btnReadAloud = document.getElementById('btn-read-aloud');

    document.getElementById('btn-start').addEventListener('click', () => {
      studentCode = inputStudentCode.value.trim().toUpperCase() || 'H01';
      studentTag.textContent = 'Mã HS: ' + studentCode;
      startScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      loadQuestion(0);
    });

    btnReadAloud.addEventListener('click', () => {
      const q = GAME_DATA.questions[currentIndex];
      speakVietnamese(q.questionText);
    });

    function loadQuestion(index) {
      currentIndex = index;
      currentQuestionAttempts = 0;
      feedbackArea.classList.add('hidden');
      btnNext.classList.add('hidden');
      
      const q = GAME_DATA.questions[index];
      qProgress.textContent = 'Câu ' + (index + 1) + ' / ' + GAME_DATA.questions.length;
      progressFill.style.width = Math.round(((index) / GAME_DATA.questions.length) * 100) + '%';
      qText.textContent = q.questionText;

      // Render Stage
      qStage.innerHTML = '';
      if (q.visualData.type === 'svg_items' && q.visualData.items) {
        q.visualData.items.forEach(it => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = renderSvgItem(it.svgType);
          wrapper.title = 'Chạm để đếm';
          wrapper.addEventListener('click', () => {
            wrapper.style.transform = 'scale(1.25)';
            setTimeout(() => { wrapper.style.transform = 'scale(1)'; }, 150);
          });
          qStage.appendChild(wrapper);
        });
      } else if (q.visualData.type === 'compare_groups') {
        const ga = q.visualData.groupA;
        const gb = q.visualData.groupB;
        let htmlA = '<div style="display:flex; gap:6px; flex-wrap:wrap; max-width:200px;">';
        for(let i=0; i<ga.count; i++) htmlA += renderSvgItem(ga.svgType);
        htmlA += '</div>';
        let htmlB = '<div style="display:flex; gap:6px; flex-wrap:wrap; max-width:200px;">';
        for(let i=0; i<gb.count; i++) htmlB += renderSvgItem(gb.svgType);
        htmlB += '</div>';
        qStage.innerHTML = '<div style="display:flex; align-items:center; gap:24px; justify-content:center;">' +
          '<div><div style="font-weight:bold; font-size:1.4rem; margin-bottom:6px;">' + ga.count + '</div>' + htmlA + '</div>' +
          '<div style="font-size:2rem; font-weight:800; color:#0284C7;">?</div>' +
          '<div><div style="font-weight:bold; font-size:1.4rem; margin-bottom:6px;">' + gb.count + '</div>' + htmlB + '</div>' +
          '</div>';
      } else if (q.visualData.type === 'train') {
        let carsHtml = '';
        (q.visualData.trainCars || []).forEach(val => {
          carsHtml += '<div style="display:inline-block; background:' + (val === null ? '#FEF08A' : '#93C5FD') + '; border:3px solid #2563EB; border-radius:12px; padding:12px 18px; margin:0 6px; font-size:1.8rem; font-weight:bold;">' + (val === null ? '❓' : val) + '</div>';
        });
        qStage.innerHTML = '<div style="display:flex; align-items:center; justify-content:center;">' +
          '<span style="font-size:2.5rem; margin-right:8px;">🚂</span>' + carsHtml + '</div>';
      } else if (q.visualData.type === 'number_house') {
        const top = q.visualData.houseTop;
        const left = q.visualData.houseLeft;
        qStage.innerHTML = '<div style="background:#FEF3C7; border:3px solid #F59E0B; border-radius:24px; padding:20px; width:220px; margin:0 auto;">' +
          '<div style="font-size:2.2rem; font-weight:800; color:#B45309; border-bottom:3px solid #F59E0B; padding-bottom:6px; margin-bottom:12px;">🏠 ' + top + '</div>' +
          '<div style="display:flex; justify-content:space-around; font-size:1.8rem; font-weight:bold;">' +
          '<div style="background:#FFF; padding:10px 14px; border-radius:12px; border:2px solid #FCD34D;">' + left + '</div>' +
          '<div style="background:#FFF; padding:10px 14px; border-radius:12px; border:2px solid #FCD34D; color:#0284C7;">❓</div>' +
          '</div></div>';
      } else {
        qStage.innerHTML = '<div style="font-size:2.5rem; font-weight:800; color:#0284C7; letter-spacing:2px;">' + (q.visualData.items?.[0]?.label || '✨') + '</div>';
      }

      // Render Options
      qOptions.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleSelectOption(opt, btn));
        qOptions.appendChild(btn);
      });
    }

    function handleSelectOption(selected, btnElement) {
      const q = GAME_DATA.questions[currentIndex];
      currentQuestionAttempts++;
      totalAttempts++;

      const isCorrect = String(selected).trim() === String(q.correctAnswer).trim();

      if (isCorrect) {
        playDing(true);
        if (currentQuestionAttempts === 1) correctCount++;
        sessionAnswers.push({ questionId: q.id, selected, isCorrect: true, attempts: currentQuestionAttempts });

        btnElement.style.background = '#86EFAC';
        btnElement.style.borderColor = '#16A34A';

        // Disable options
        Array.from(qOptions.children).forEach(b => b.disabled = true);

        feedbackArea.className = 'feedback-box feedback-success';
        feedbackArea.innerHTML = '🎉 <strong>Con làm rất tốt!</strong> ' + q.explanation;
        feedbackArea.classList.remove('hidden');

        btnNext.classList.remove('hidden');
      } else {
        playDing(false);
        hintsUsed++;
        feedbackArea.className = 'feedback-box feedback-retry';
        feedbackArea.innerHTML = '💡 <strong>Con thử lại nhé!</strong> ' +
          '<div class="hint-text">' + q.pedagogicalHint + '</div>';
        feedbackArea.classList.remove('hidden');
      }
    }

    btnNext.addEventListener('click', () => {
      if (currentIndex + 1 < GAME_DATA.questions.length) {
        loadQuestion(currentIndex + 1);
      } else {
        finishGame();
      }
    });

    function finishGame() {
      progressFill.style.width = '100%';
      gameScreen.classList.add('hidden');
      resultScreen.classList.remove('hidden');

      const percent = Math.round((correctCount / GAME_DATA.questions.length) * 100);
      let praise = 'Con học rất chăm chỉ!';
      if (percent >= 80) praise = '🌟 Tuyệt vời! Con đã hoàn thành xuất sắc trò chơi!';
      else if (percent >= 60) praise = '👏 Con làm rất tốt, hãy tiếp tục phát huy nhé!';

      document.getElementById('summary-text').textContent = praise;
      document.getElementById('res-correct').textContent = correctCount + ' / ' + GAME_DATA.questions.length + ' (' + percent + '%)';
      document.getElementById('res-attempts').textContent = totalAttempts + ' lượt';
      document.getElementById('res-hints').textContent = hintsUsed + ' lần';
    }

    // Export result JSON to file
    document.getElementById('btn-export-result').addEventListener('click', () => {
      const resultObj = {
        studentCode,
        gameId: GAME_DATA.id,
        gameTitle: GAME_DATA.title,
        totalQuestions: GAME_DATA.questions.length,
        correctQuestions: correctCount,
        attemptsCount: totalAttempts,
        hintsCount: hintsUsed,
        completedAt: new Date().toISOString(),
        answers: sessionAnswers
      };
      const blob = new Blob([JSON.stringify(resultObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'KetQua_' + studentCode + '_' + GAME_DATA.id + '.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
      currentIndex = 0;
      correctCount = 0;
      totalAttempts = 0;
      hintsUsed = 0;
      sessionAnswers.length = 0;
      resultScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      loadQuestion(0);
    });
  </script>
</body>
</html>`;
}
