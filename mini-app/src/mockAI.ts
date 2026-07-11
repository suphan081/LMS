import { Lesson, QuizQuestion, Course, ChatMessage, AIWeaknessReport } from './types';

// Helper to simulate delay for AI responses
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates an AI summary for a specific lesson.
 */
export function mockSummary(lesson: Lesson): string {
  if (lesson.id.startsWith('toeic-l1')) {
    return `### ⚡ TÓM TẮT AI - Part 1: Photos of People
Chào bạn! Dưới đây là phân tích cốt lõi từ AI cho bài học này:

#### 1. Các điểm ngữ pháp mấu chốt:
*   **Thì hiện tại tiếp diễn (Present Continuous)**: Luôn dùng để diễn tả các hành động đang xảy ra tại thời điểm chụp ảnh. Cấu trúc: \`S + is/are + V-ing\`.
*   **Trạng thái cơ thể (Posture Verbs)**: Cần phân biệt kỹ động từ chỉ hành động (\`reaching for\`, \`gazing at\`) và trạng thái (\`sitting\`, \`leaning\`).

#### 2. Chiến thuật tránh "Bẫy điểm cao" của TOEIC:
*   ❌ **Bẫy đồng âm (Homophones)**: Từ phát âm giống nhau nhưng nghĩa khác (ví dụ: \`sheet\` vs \`seat\`, \`paper\` vs \`pepper\`).
*   ❌ **Đúng động từ, sai danh từ**: Động từ miêu tả đúng hành động nhưng sai đối tượng hành động tác động lên (ví dụ: \`He is reading a menu\` trong khi anh ấy đang đọc tờ quảng cáo).
*   ❌ **Chủ ngữ không có trong ảnh**: Nghe kỹ chủ ngữ. Nếu câu nghe rất đúng nhưng chủ ngữ không hề xuất hiện trong ảnh, hãy loại ngay lập tức.

#### 3. Bộ từ vựng "vàng" cần thuộc lòng:
*   \`Leaning over\` (Cúi người trên)
*   \`Gazing at / Examining\` (Chăm chú nhìn / Nghiên cứu)
*   \`Reaching for\` (Với tay lấy vật gì)
*   \`Stacked / Piled\` (Được xếp chồng lên nhau)`;
  }

  if (lesson.id.startsWith('toeic-l2')) {
    return `### ⚡ TÓM TẮT AI - Part 2: Wh-Questions
Dưới đây là tóm tắt chiến thuật thông minh từ trợ lý AI:

#### 1. Phân loại Wh-Questions & Cách trả lời:
*   **WHO (Ai)**: Trả lời thường là Tên riêng, Chức danh (\`Manager\`, \`Supervisor\`), Bộ phận (\`HR Department\`), hoặc các đại từ (\`Someone in sales\`).
*   **WHERE (Ở đâu)**: Trả lời thường là Giới từ chỉ nơi chốn (\`Next to\`, \`In the drawer\`), hoặc hướng đi (\`Upstairs\`).
*   **WHEN (Khi nào)**: Trả lời chỉ thời gian (\`By tomorrow\`, \`Next Monday\`), hoặc các liên từ chỉ điều kiện (\`As soon as the meeting ends\`).

#### 2. Các "Bẫy ngầm" cần loại trừ:
*   ⚠️ **Yes/No cho câu Wh-**: TOEIC cực kỳ thích lừa bằng cách đưa phương án \`Yes / No\` vào đầu các câu trả lời của Wh-questions. Loại ngay lập tức!
*   ⚠️ **Lặp từ (Repetitive sound)**: Đáp án đúng thường paraphrase (diễn đạt bằng từ đồng nghĩa), đáp án bẫy thường cố tình lặp lại từ có trong câu hỏi.

#### 3. Xuuyên hướng trả lời gián tiếp (Indirect Answers):
*   Khi hỏi "Khi nào họp?", câu trả lời không nói giờ mà nói: *"Lịch trình bị hoãn rồi"* hoặc *"Hãy hỏi cô Mary ấy"*. Đây là xu hướng ra đề mới của ETS để phân loại thí sinh khá/giỏi.`;
  }

  if (lesson.id.startsWith('toeic-g1')) {
    return `### ⚡ TÓM TẮT AI - Subject-Verb Agreement
Phân tích ngữ pháp tinh gọn từ AI giúp bạn ghi nhớ nhanh:

#### 1. Quy tắc cốt lõi:
*   Chủ ngữ danh từ ghép có giới từ: \`N1 + preposition + N2\`. Động từ luôn chia theo **N1** chứ không chia theo N2.
    *   *Ví dụ:* \`The catalog of new products [is/are] ready\` -> Chủ ngữ chính là \`catalog\` (số ít) -> Chọn \`is\`.
*   **Either A or B / Neither A nor B**: Động từ chia theo **B** (chủ ngữ đứng gần động từ nhất).
*   **Danh từ tập hợp** (\`committee\`, \`delegation\`, \`board\`, \`staff\`): Thường chia số ít khi coi là 1 tập thể thống nhất.

#### 2. Mẹo làm bài Part 5 trong 5 giây:
*   Nhìn phía trước khoảng trống xem có cụm giới từ (\`of\`, \`with\`, \`in\`, \`for\`) không. Gạch chân chủ ngữ thực sự ở đầu cụm để chia động từ ngay.
*   Cảnh giác với Gerund làm chủ ngữ (\`V-ing\`). V-ing làm chủ ngữ luôn luôn chia động từ ở dạng **số ít**!`;
  }

  if (lesson.id.startsWith('jlpt-g1')) {
    return `### ⚡ TÓM TẮT AI - Ngữ pháp N3: Biểu đạt ý định
Tóm tắt so sánh cấu trúc chỉ ý định, giúp bạn không bao giờ nhầm lẫn trong phòng thi:

#### 1. So sánh 3 cấu trúc cốt lõi:
1.  **V-る / V-ない + つもりだ (Dự định):**
    *   Ý định đã được suy nghĩ và lên kế hoạch từ trước đó. Quyết tâm khá cao.
    *   *Ví dụ:* \`大学に進学するつもりです\` (Tôi dự định học lên đại học).
2.  **V-ý chí + と思う (Định làm):**
    *   Ý định bộc phát tại thời điểm nói hoặc dự định mang tính cá nhân nhẹ nhàng. Nếu dùng \`と思っています\` thì ý định này đã có từ lâu.
    *   *Ví dụ:* \`明日、早く起きようと思います\` (Tôi định ngày mai dậy sớm).
3.  **V-る + 予定 (よてい) だ (Kế hoạch):**
    *   Kế hoạch mang tính khách quan, lịch trình đã được định sẵn bởi tổ chức, xã hội, hoặc lịch tàu xe công việc công cộng. Không dựa vào ý chí cá nhân.

#### 2. Điểm ngữ pháp bẫy trong JLPT:
*   Tuyệt đối không dùng \`つもり\` cho các hành động thiên nhiên hoặc các hành động bất khả kháng của người khác.
*   Thể ý chí của động từ nhóm 3 (\`する\` -> \`しよう\`, \`来る\` -> \`来よう\`) là phần rất hay bị kiểm tra trong phần chia động từ.`;
  }

  // Fallback default response
  return `### ⚡ TÓM TẮT AI - ${lesson.title}
*   **Trọng tâm bài học:** Hệ thống hóa toàn bộ kiến thức lý thuyết đã trình bày trong tài liệu, tập trung sâu vào ứng dụng thực tế.
*   **Phân tích bẫy đề thi:** AI phát hiện học viên thường nhầm lẫn các khái niệm tương đương. Hãy chú ý các phần so sánh song song.
*   **Lời khuyên từ AI:** Làm bài tập trắc nghiệm đi kèm ngay sau khi học để đạt hiệu quả ghi nhớ dài hạn lên tới 80%.`;
}

/**
 * Returns detailed AI analysis of a specific answer to a quiz question.
 */
export function mockExplain(question: QuizQuestion, selectedIndex: number): string {
  const isCorrect = selectedIndex === question.correctIndex;
  
  let base = `#### 🤖 PHÂN TÍCH CHI TIẾT TỪ AI:
`;

  if (isCorrect) {
    base += `🎉 **Chính xác!** Bạn đã chọn đúng phương án: **"${question.options[selectedIndex]}"**.\n\n`;
  } else {
    base += `❌ **Chưa chính xác.** Bạn đã chọn: *"${question.options[selectedIndex]}"*. \nPhương án đúng phải là: **"${question.options[question.correctIndex]}"**.\n\n`;
  }

  base += `**Giải thích cụ thể:**
*   ${question.explanation}
*   **Phân tích bẫy từ AI:** Các phương án nhiễu (distractors) còn lại được thiết kế dựa trên các lỗi sai thường gặp của học viên Việt Nam:
`;

  question.options.forEach((opt, idx) => {
    if (idx === question.correctIndex) {
      base += `    *   ✨ **"${opt}"** (Đáp án đúng): Khớp hoàn toàn với quy tắc ngữ pháp và ngữ cảnh bài học.`;
    } else {
      base += `    *   ⚠️ **"${opt}"** (Bẫy loại ${idx + 1}): Cố tình dùng từ đồng âm hoặc đánh lừa về mặt thời gian/chủ từ nhưng không hợp logic của câu.`;
    }
    base += `\n`;
  });

  return base;
}

/**
 * Simulates generating an automated quiz from a lesson, creating step-by-step log output.
 */
export async function simulateQuizGenerationLogs(lessonTitle: string, onLog: (log: string) => void) {
  const logs = [
    `🔍 Đang quét nội dung bài học: "${lessonTitle}"...`,
    `🧠 AI đang phân tích các từ khóa trọng tâm và cấu trúc ngữ pháp cần đánh giá...`,
    `⚡ Đang trích xuất dữ liệu bẫy lỗi (distractors) dựa trên ngân hàng lỗi sai của 10.000 học viên...`,
    `🔍 Thiết lập 3 câu hỏi trắc nghiệm khách quan với độ khó tăng dần...`,
    `✨ Viết phần giải thích chi tiết (AI explanation) cho từng câu hỏi...`,
    `✅ Hoàn thành! Đã nạp thành công 3 câu hỏi trắc nghiệm mới vào hệ thống.`
  ];

  for (const log of logs) {
    onLog(log);
    await delay(600);
  }
}

/**
 * Generates an AI weakness analysis report based on quiz scores.
 */
export function mockWeakness(quizScores: { [quizId: string]: number }, orgId: string): AIWeaknessReport {
  if (orgId === 'TOEIC_CENTER') {
    const l1Score = quizScores['q-toeic-l1'] !== undefined ? quizScores['q-toeic-l1'] : -1;
    const l2Score = quizScores['q-toeic-l2'] !== undefined ? quizScores['q-toeic-l2'] : -1;
    const g1Score = quizScores['q-toeic-g1'] !== undefined ? quizScores['q-toeic-g1'] : -1;

    let totalQuizzes = 0;
    let avg = 0;
    if (l1Score !== -1) { totalQuizzes++; avg += l1Score; }
    if (l2Score !== -1) { totalQuizzes++; avg += l2Score; }
    if (g1Score !== -1) { totalQuizzes++; avg += g1Score; }
    avg = totalQuizzes > 0 ? avg / totalQuizzes : 50;

    const listeningScore = l1Score !== -1 ? Math.round(l1Score * 10) : 60;
    const grammarScore = g1Score !== -1 ? Math.round(g1Score * 10) : 45;
    const vocabularyScore = l2Score !== -1 ? Math.round(l2Score * 10) : 70;
    const readingScore = Math.round((grammarScore + vocabularyScore) / 2);

    // Dynamic summary based on scores
    let summary = 'Bạn đang bắt đầu học rất tốt. Tuy nhiên, hệ thống nhận thấy bạn cần củng cố thêm kỹ năng Phân tích cấu trúc Ngữ pháp câu ghép.';
    const recommendations = [
      'Luyện tập thêm 15 câu trắc nghiệm về Subject-Verb Agreement tại mục Grammar Booster.',
      'Sử dụng AI Chat đặt câu hỏi: "Cho mình thêm 3 ví dụ về bẫy danh từ tập hợp trong TOEIC".',
      'Chú ý bẫy "Đúng động từ, sai danh từ" khi làm các câu mô tả tranh Part 1.'
    ];

    if (grammarScore < 60) {
      summary = '⚠️ CẢNH BÁO AI: Kỹ năng Ngữ pháp (Grammar SVA) đang là điểm yếu lớn nhất của bạn. Bạn thường chia sai động từ khi chủ ngữ bị chia cắt bởi cụm giới từ.';
      recommendations.unshift('Học lại bài "Subject-Verb Agreement Rules" và ghi chép lại quy tắc N1 + preposition + N2.');
    } else if (listeningScore < 60) {
      summary = '⚠️ CẢNH BÁO AI: Kỹ năng Nghe tranh (Part 1) của bạn chưa ổn định do bỏ sót các chi tiết nhỏ về tư thế cơ thể.';
      recommendations.unshift('Luyện tập nhận diện các động từ tư thế trạng thái tĩnh như "leaning", "gazing" thay vì chỉ tập trung vào hành động động.');
    } else if (avg > 80) {
      summary = '🌟 ĐÁNH GIÁ AI: Xuất sắc! Bạn nắm rất vững kiến thức cả nghe lẫn ngữ pháp. Hãy tự tin tăng tốc độ giải đề để tối ưu thời gian.';
      recommendations.unshift('Thử sức với các đề thi thử TOEIC Full Test Part 1 & 5 để cải thiện tốc độ phản xạ.');
    }

    return {
      skills: [
        { name: 'Listening (Nghe tranh)', score: listeningScore },
        { name: 'Grammar (Ngữ pháp)', score: grammarScore },
        { name: 'Vocabulary (Từ vựng)', score: vocabularyScore },
        { name: 'Reading (Đọc hiểu)', score: readingScore },
      ],
      summary,
      recommendations
    };
  } else {
    // JLPT Center
    const g1Score = quizScores['q-jlpt-g1'] !== undefined ? quizScores['q-jlpt-g1'] : -1;
    const g2Score = quizScores['q-jlpt-g2'] !== undefined ? quizScores['q-jlpt-g2'] : -1;
    const k1Score = quizScores['q-jlpt-k1'] !== undefined ? quizScores['q-jlpt-k1'] : -1;

    let totalQuizzes = 0;
    let avg = 0;
    if (g1Score !== -1) { totalQuizzes++; avg += g1Score; }
    if (g2Score !== -1) { totalQuizzes++; avg += g2Score; }
    if (k1Score !== -1) { totalQuizzes++; avg += k1Score; }
    avg = totalQuizzes > 0 ? avg / totalQuizzes : 50;

    const kanjiScore = k1Score !== -1 ? Math.round(k1Score * 10) : 55;
    const grammarScore = g1Score !== -1 ? Math.round(g1Score * 10) : 50;
    const readingScore = g2Score !== -1 ? Math.round(g2Score * 10) : 60;
    const listeningScore = Math.round((grammarScore + readingScore) / 2);

    let summary = 'Bạn có nền tảng ngữ pháp tương đối tốt nhưng tốc độ ghi nhớ chữ Hán tự (Kanji) chủ đề công sở còn khá chậm.';
    const recommendations = [
      'Ghi nhớ kỹ cách phát âm biến âm đục như ざんぎょう (Zangyou).',
      'Xem lại bài học ngữ pháp so sánh "わけがない" và "はずがない" để hiểu rõ tính logic thực tế.',
      'Sử dụng AI Chat hỏi: "Viết hộ mình đoạn văn ngắn sử dụng つもり và 予定 để mình phân biệt".'
    ];

    if (kanjiScore < 60) {
      summary = '⚠️ CẢNH BÁO AI: Vốn chữ Hán công sở (Kanji) của bạn đang ở mức đáng báo động. Bạn hay nhầm lẫn cách đọc Onyomi của các chữ gần giống nhau.';
      recommendations.unshift('Luyện viết bộ thủ và làm lại Quiz "Hán tự chủ đề Công sở" để nâng điểm số.');
    } else if (grammarScore < 60) {
      summary = '⚠️ CẢNH BÁO AI: Bạn đang bị nhầm lẫn sâu sắc giữa các cấu trúc ý chí chủ quan (つもり, と思う) và kế hoạch khách quan (予定).';
      recommendations.unshift('Học lại bài học "Expressing Intentions: つもり và ようと思う" và chú ý phân loại tính khách quan.');
    } else if (avg > 80) {
      summary = '🌟 ĐÁNH GIÁ AI: Chúc mừng! Bạn đang học rất hiệu quả lộ trình N3. Chữ Hán và ngữ pháp đều đạt trên 80% độ chính xác.';
      recommendations.unshift('Hãy tiếp tục học sang các mẫu ngữ pháp N3 nâng cao hơn như "わけではない" hoặc "というものだ".');
    }

    return {
      skills: [
        { name: 'Kanji (Hán tự)', score: kanjiScore },
        { name: 'Grammar (Ngữ pháp)', score: grammarScore },
        { name: 'Reading (Đọc hiểu)', score: readingScore },
        { name: 'Listening (Nghe hiểu)', score: listeningScore },
      ],
      summary,
      recommendations
    };
  }
}

/**
 * Returns a smart AI Chat response that is fully context-aware of what the user is doing.
 */
export function mockChatResponse(
  message: string,
  history: ChatMessage[],
  context: {
    orgId: string;
    activeCourse?: Course;
    activeLesson?: Lesson;
    quizScores: { [quizId: string]: number };
  }
): string {
  const msgLower = message.toLowerCase();

  // 1. Greet / Introduction
  if (msgLower.includes('chào') || msgLower.includes('hello') || msgLower.includes('hi')) {
    const centerName = context.orgId === 'TOEIC_CENTER' ? 'TOEIC' : 'JLPT';
    return `Chào bạn! Mình là Trợ lý học tập AI của **${centerName} Center** 🤖.

Mình đồng hành cùng bạn để giải đáp ngữ pháp, tóm tắt bài học và chỉ ra điểm yếu sau mỗi bài test. 

Hiện tại, bạn đang học bài: **"${context.activeLesson?.title || 'Chưa chọn bài học'}"**. Bạn có câu hỏi nào cần mình giải đáp không?`;
  }

  // 2. Context-aware help for TOEIC Subject-Verb Agreement (toeic-g1)
  if (context.activeLesson?.id === 'toeic-g1' || msgLower.includes('sva') || msgLower.includes('chủ ngữ') || msgLower.includes('agreement')) {
    if (msgLower.includes('bẫy') || msgLower.includes('lừa') || msgLower.includes('lưu ý')) {
      return `### 💡 Các bẫy "Subject-Verb Agreement" cực kỳ phổ biến trong TOEIC:

1.  **Cụm giới từ xen giữa (Prepositional Interveners):**
    *   *Câu lừa:* \`The cost of the new machines [is/are] too high.\`
    *   Học viên hay nhìn chữ \`machines\` sát bên cạnh rồi chọn \`are\` -> **SAI**.
    *   *Giải thích từ AI:* Chủ ngữ chính là \`The cost\` (Số ít) -> Phải dùng \`is\`.
    
2.  **Đại từ bất định (Indefinite Pronouns):**
    *   Các từ như \`Everyone\`, \`Someone\`, \`Each\`, \`Either\`, \`Neither\` luôn luôn đi với động từ **SỐ ÍT**.
    *   *Ví dụ:* \`Each of the candidates has an interview\` (Mỗi ứng viên có một lịch phỏng vấn).
    
3.  **Danh từ tập hợp (Collective Nouns):**
    *   \`Staff\`, \`Management\`, \`Committee\` thường đi với động từ số ít trong bài thi TOEIC trừ khi nhấn mạnh từng thành viên riêng lẻ.`;
    }
    return `### ✍️ Phân tích nhanh về Subject-Verb Agreement (Hòa hợp Chủ-Vị):

Trong bài học **"${context.activeLesson?.title}"**, quy tắc quan trọng nhất là xác định **Danh từ chính** (Head Noun) làm chủ ngữ thực sự.

*   *Cú pháp cơ bản:* \`N1 + (of/in/with/between) + N2 + Verb (chia theo N1)\`.
*   *Mẹo:* Bỏ qua toàn bộ phần nằm trong dấu ngoặc đơn từ giới từ cho đến trước động từ để không bị nhầm lẫn số ít/số nhiều.

Bạn có muốn mình đưa ra 1 ví dụ cụ thể để bạn làm thử ngay không?`;
  }

  // 3. Context-aware help for TOEIC Listening Part 1 (toeic-l1)
  if (context.activeLesson?.id === 'toeic-l1' || msgLower.includes('tranh') || msgLower.includes('part 1') || msgLower.includes('listening')) {
    return `### 🎧 Mẹo nâng điểm TOEIC Listening Part 1 (Mô tả tranh):

Do bạn đang học bài **"${context.activeLesson?.title}"**, AI khuyên bạn ghi nhớ:
1.  **Phát hiện hành động nhanh:** Khi nhìn tranh có người, hãy nhẩm trước các động từ mô tả tư thế như \`holding\`, \`looking at\`, \`working on\`, \`carrying\`.
2.  **Bẫy bị động cho vật:** Nghe thấy cụm \`being + V3\` (ví dụ: \`The car is being repaired\`) mà trong tranh KHÔNG có người đang thực hiện hành động đó -> **LOẠI NGAY** vì \`being\` thể hiện hành động đang được thực hiện bởi ai đó.

Bạn cần mình giải thích từ vựng nào xuất hiện trong phần luyện tập không?`;
  }

  // 4. Context-aware help for JLPT Intention grammar (jlpt-g1)
  if (context.activeLesson?.id === 'jlpt-g1' || msgLower.includes('tsumori') || msgLower.includes('yotei') || msgLower.includes('つもり') || msgLower.includes('予定')) {
    return `### 🏮 Phân biệt つもり (Tsumori) và 予定 (Yotei) cực dễ hiểu từ AI:

1.  **つもり (Tsumori - Dự định):**
    *   Là dự định **nằm hoàn toàn trong đầu bạn**, mang tính cá nhân, chủ quan. Chưa chắc chắn 100%.
    *   *Ví dụ:* \`日本に留学するつもりです\` (Tôi dự định đi du học Nhật - Quyết định của tôi).
2.  **予定 (Yotei - Kế hoạch):**
    *   Là kế hoạch **đã được ghi vào lịch trình**, đã hẹn với người khác, hoặc do cơ quan/tổ chức quy định. Rất khách quan và khó thay đổi.
    *   *Ví dụ:* \`来週、出張する予定です\` (Tuần tới tôi có lịch đi công tác - Công ty đã xếp lịch).

*Tóm lại:* Ý chí cá nhân dùng **つもり**, lịch trình khách quan dùng **予定**.`;
  }

  // 5. Context-aware help for JLPT わけがない (jlpt-g2)
  if (context.activeLesson?.id === 'jlpt-g2' || msgLower.includes('wake') || msgLower.includes('hazu') || msgLower.includes('わけがない') || msgLower.includes('はずがない')) {
    return `### 🏮 Giải thích ngữ pháp N3: わけがない vs はずがない

Cả hai mẫu câu đều có nghĩa là **"Không có lý nào / Chắc chắn không thể..."** nhưng cách dùng có chút khác biệt:

*   **わけがない (wake ga nai):**
    *   Dựa trên **lý lẽ thực tế khách quan**, mang tính logic hiển nhiên. Ai nhìn vào cũng thấy thế.
    *   *Ví dụ:* \`この薬 là 苦いから、子供が喜んで飲むわけがない。\` (Thuốc này đắng thế, làm gì có lý nào trẻ con lại thích uống).
*   **はずがない (hazu ga nai):**
    *   Dựa trên **niềm tin, sự tin tưởng chủ quan** của người nói dựa trên thông tin đã có.
    *   *Ví dụ:* \`彼は親切な人だから, そんなひどいことを言うはずがない。\` (Anh ấy là người tử tế, chắc chắn không thể nào nói lời tồi tệ như vậy).`;
  }

  // 6. Generic learning queries
  if (msgLower.includes('bài tập') || msgLower.includes('luyện tập') || msgLower.includes('quiz')) {
    return `Để ôn tập tốt nhất cho bài học **"${context.activeLesson?.title || 'hiện tại'}"**, bạn hãy bấm nút **"Generate Quiz"** ngay trên màn hình bài học để AI tự động thiết kế đề kiểm tra nhanh cho bạn nhé!`;
  }

  if (msgLower.includes('yếu') || msgLower.includes('weakness') || msgLower.includes('kết quả')) {
    return `Để xem phân tích điểm yếu và đề xuất lộ trình cải thiện cá nhân hóa từ AI, bạn hãy chuyển sang tab **"Profile" (Cá nhân)** ở dưới thanh điều hướng nhé. AI đã chuẩn bị sẵn sơ đồ radar kỹ năng của riêng bạn đấy!`;
  }

  // Fallback AI conversation answer
  return `### 🤖 Trợ lý AI đang ghi nhận thắc mắc của bạn:
Bạn vừa hỏi: *"${message}"*

Dựa trên ngữ cảnh bài học hiện tại (**${context.activeLesson?.title}**), mình khuyên bạn nên:
1.  **Ôn tập lý thuyết cốt lõi** trong giáo trình trước.
2.  **Thử sức với Quiz 3 câu hỏi nhanh** để AI đánh giá xem bạn có bị mắc bẫy đề thi hay không.
3.  Nếu có câu hỏi chi tiết về từ vựng hay ngữ pháp, cứ nhắn ở đây, mình sẽ giải đáp ngay lập tức!`;
}
