import { getGeminiApiKey } from './ai';

export interface WordBreakdown {
  word: string;             // Chữ Hán hoặc từ gốc (vd: 兄, 日本, 働いています)
  furigana?: string;        // Cách đọc Hiragana (vd: あに, にほん, はたらいています)
  romaji?: string;          // Phiên âm Latin (vd: ani, nihon, hataraite imasu)
  partOfSpeech: string;     // Từ loại (vd: Danh từ, Trợ từ, Động từ nhóm 1)
  meaning: string;          // Nghĩa tiếng Việt trong câu
  role: string;             // Vai trò ngữ pháp (vd: Chủ ngữ, Bổ ngữ địa điểm)
  conjugation?: string;     // Dạng chia động từ/tính từ nếu có
}

export interface GrammarPoint {
  pattern: string;          // Mẫu ngữ pháp (vd: V-ています, Địa điểm + で, N1 の N2)
  meaning: string;          // Ý nghĩa ngắn gọn
  explanation: string;      // Giải thích chi tiết cho người học N5
  jlptLevel?: string;       // "N5"
}

export interface GrammarAnalysis {
  sentence: string;
  reading?: string;
  vietnamese: string;
  overview: string;                 // Mô tả tổng quát cấu trúc câu
  structureFormula: string;         // Công thức cấu trúc câu trực quan
  words: WordBreakdown[];           // Phân tích chi tiết từng từ
  grammarPoints: GrammarPoint[];    // Các điểm ngữ pháp N5 trọng tâm
  n5Tips: string[];                 // Mẹo ghi nhớ & lưu ý thi JLPT N5
}

const STORAGE_CACHE_KEY = 'nihonflash_grammar_cache_v1';

/** Helper to read cache */
function getCachedAnalysis(sentence: string): GrammarAnalysis | null {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[sentence.trim()] || null;
  } catch {
    return null;
  }
}

/** Helper to save cache */
function setCachedAnalysis(sentence: string, data: GrammarAnalysis): void {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[sentence.trim()] = data;
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to cache grammar analysis:', err);
  }
}

import { PRESET_N5_ANALYSES } from './grammarData';
export { PRESET_N5_ANALYSES };

/**
 * Intelligent Structural Fallback Analyzer for any Japanese sentence
 */
export function generateSmartRuleBasedAnalysis(
  sentence: string,
  reading?: string,
  vietnamese?: string
): GrammarAnalysis {
  const cleanSent = sentence.trim();
  const words: WordBreakdown[] = [];
  const grammarPoints: GrammarPoint[] = [];
  const n5Tips: string[] = [];

  // Parse particles and tokens
  // Common particles in N5: は, が, を, に, で, へ, と, から, まで, より, の, も
  if (cleanSent.includes('は')) {
    grammarPoints.push({
      pattern: 'Trợ từ「は」(đọc là wa)',
      meaning: 'Đánh dấu chủ đề (topic marker)',
      explanation: 'Trợ từ は đứng sau danh từ để đưa thành phần đó lên làm chủ đề chính của câu ("Về phần... thì, Đối với... thì"). Viết là "ha" nhưng đọc là "wa".',
      jlptLevel: 'N5'
    });
  }

  if (cleanSent.includes('で')) {
    grammarPoints.push({
      pattern: 'Trợ từ「で」(nơi chốn / phương tiện)',
      meaning: 'Tại, ở, bằng phương tiện gì',
      explanation: 'Chỉ nơi diễn ra một hành động cụ thể (vd: 教室で勉強する) hoặc công cụ, phương tiện thực hiện (vd: バスで行く, はしで食べる).',
      jlptLevel: 'N5'
    });
  }

  if (cleanSent.includes('に')) {
    grammarPoints.push({
      pattern: 'Trợ từ「に」(thời gian / đích đến / tồn tại)',
      meaning: 'Vào lúc, tại (tồn tại), đến',
      explanation: 'Dùng để chỉ mốc thời gian cụ thể (7時に), đích đến của di chuyển (学校に行く), hoặc vị trí tồn tại của người/vật (部屋にいる).',
      jlptLevel: 'N5'
    });
  }

  if (cleanSent.includes('を')) {
    grammarPoints.push({
      pattern: 'Trợ từ「を」(đọc là o)',
      meaning: 'Đánh dấu tân ngữ trực tiếp',
      explanation: 'Đứng sau danh từ chịu tác động trực tiếp của ngoại động từ (vd: ご飯を食べる: ăn cơm, 本を読む: đọc sách).',
      jlptLevel: 'N5'
    });
  }

  if (cleanSent.includes('ています') || cleanSent.includes('ている')) {
    grammarPoints.push({
      pattern: 'V-ています (Thì hiện tại tiếp diễn / Trạng thái)',
      meaning: 'Đang làm gì / Trạng thái diễn tiến',
      explanation: 'Động từ chia thể Te + います diễn tả: (1) Hành động đang diễn ra ngay lúc nói; (2) Trạng thái duy trì liên tục như nghề nghiệp, hôn nhân, chỗ ở.',
      jlptLevel: 'N5'
    });
    n5Tips.push('Đề thi JLPT N5 hay hỏi dạng V-ています cho nghề nghiệp (会社で働いています) và trạng thái (知っています, 結婚しています).');
  }

  if (cleanSent.includes('てください')) {
    grammarPoints.push({
      pattern: 'V-てください (Yêu cầu / Nhờ vả lịch sự)',
      meaning: 'Xin hãy làm gì...',
      explanation: 'Động từ chia thể Te kết hợp ください dùng để đề nghị, nhờ vả đối phương thực hiện một hành động một cách lịch sự.',
      jlptLevel: 'N5'
    });
  }

  if (cleanSent.includes('たいです')) {
    grammarPoints.push({
      pattern: 'V (bỏ masu) + たいです (Nguyện vọng bản thân)',
      meaning: 'Muốn làm gì...',
      explanation: 'Bỏ đuôi masu thêm たいです để diễn đạt ước muốn, nguyện vọng của người nói (Ngôi thứ nhất).',
      jlptLevel: 'N5'
    });
  }

  if (cleanSent.includes('ました')) {
    n5Tips.push('Đuôi động từ「〜ました」thể hiện hành động đã hoàn tất trong quá khứ ở mức độ lịch sự (thể Masu).');
  }

  if (cleanSent.includes('ません')) {
    n5Tips.push('Đuôi động từ「〜ません」thể hiện phủ định lịch sự ở hiện tại/tương lai (Không làm / Sẽ không làm).');
  }

  if (n5Tips.length === 0) {
    n5Tips.push('Chú ý phân biệt trợ từ chủ đề は (wa) và trợ từ chủ ngữ が (ga) trong các dạng bài ngữ pháp JLPT N5.');
    n5Tips.push('Thường xuyên ôn luyện cách chia thể Te (〜て), thể Ta (〜た) và thể Nai (〜ない) của 3 nhóm động từ.');
  }

  // Generate generic word breakdown if pre-analysis is not found
  words.push({
    word: cleanSent,
    furigana: reading || cleanSent,
    romaji: '',
    partOfSpeech: 'Cụm câu hoàn chỉnh',
    meaning: vietnamese || 'Mẫu câu giao tiếp N5',
    role: 'Nội dung thực hành ngữ pháp'
  });

  return {
    sentence: cleanSent,
    reading: reading || '',
    vietnamese: vietnamese || '',
    overview: `Câu ví dụ thực hành ứng dụng các mẫu ngữ pháp và trợ từ cốt lõi trong chương trình JLPT N5.`,
    structureFormula: `[Thành phần câu] + Trợ từ liên kết + Vị ngữ kết thúc câu`,
    words,
    grammarPoints: grammarPoints.length > 0 ? grammarPoints : [
      {
        pattern: 'Cấu trúc câu chuẩn tiếng Nhật (SOV)',
        meaning: 'Chủ ngữ - Tân ngữ/Bổ ngữ - Vị ngữ (Động từ)',
        explanation: 'Trong tiếng Nhật, động từ và vị ngữ luôn nằm ở vị trí CUỐI CÙNG của câu, khác với tiếng Việt (SVO).',
        jlptLevel: 'N5'
      }
    ],
    n5Tips
  };
}

/**
 * Main AI Grammar Analyzer Function
 * 1. Checks memory & cache
 * 2. Checks pre-analyzed dataset (0ms response)
 * 3. Calls Google Gemini API if key is available
 * 4. Falls back to smart rule-based parser
 */
export async function analyzeGrammarWithAI(
  sentence: string,
  reading?: string,
  vietnamese?: string,
  forceRefresh: boolean = false
): Promise<GrammarAnalysis> {
  const cleanSent = sentence.trim();

  // 1. Check local cache (unless user explicitly requested re-analysis)
  if (!forceRefresh) {
    const cached = getCachedAnalysis(cleanSent);
    if (cached) return cached;

    // 2. Check preset high-quality analyses
    if (PRESET_N5_ANALYSES[cleanSent]) {
      const preset = PRESET_N5_ANALYSES[cleanSent];
      setCachedAnalysis(cleanSent, preset);
      return preset;
    }
  }

  // 3. Try Gemini API
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    try {
      const systemInstruction = `Bạn là chuyên gia ngôn ngữ Nhật Bản và giảng viên luyện thi JLPT N5 hàng đầu.
Nhiệm vụ của bạn là nhận vào câu tiếng Nhật, phiên âm và dịch nghĩa, sau đó phân tích ngữ pháp toàn diện, cực kỳ chi tiết, mạch lạc và chuẩn sư phạm cho người học trình độ N5.

Quy tắc xuất bản: Trả về ĐÚNG 1 ĐỐI TƯỢNG JSON với cấu trúc sau:
{
  "sentence": "Câu tiếng Nhật gốc",
  "reading": "Phiên âm Hiragana/Romaji",
  "vietnamese": "Dịch nghĩa tiếng Việt chuẩn",
  "overview": "Mô tả tổng quát cấu trúc và ý đồ biểu đạt của câu",
  "structureFormula": "Công thức ngữ pháp trực quan (VD: S + は + Địa điểm + で + V-ています)",
  "words": [
    {
      "word": "Từ hoặc trợ từ (chữ Hán/gốc)",
      "furigana": "Cách đọc Hiragana",
      "romaji": "Phiên âm romaji",
      "partOfSpeech": "Từ loại (Danh từ, Động từ nhóm 1/2/3, Tính từ đuôi い/な, Trợ từ, Phó từ...)",
      "meaning": "Nghĩa trong câu",
      "role": "Vai trò ngữ pháp trong câu",
      "conjugation": "Nếu là động từ/tính từ, nêu rõ thể chia (nguyên thể -> thể chia) và nhóm động từ, lưu ý phân biệt xưng hô nếu là danh từ"
    }
  ],
  "grammarPoints": [
    {
      "pattern": "Mẫu ngữ pháp trong câu (VD: V-ています, N1 の N2...)",
      "meaning": "Ý nghĩa mẫu ngữ pháp",
      "explanation": "Giải thích cặn kẽ cách dùng cho người học N5",
      "jlptLevel": "N5"
    }
  ],
  "n5Tips": [
    "Mẹo ghi nhớ hoặc điểm lưu ý tránh bẫy trong đề thi JLPT N5 liên quan đến câu này"
  ]
}

CHỈ TRẢ VỀ DUY NHẤT ĐỐI TƯỢNG JSON HỢP LỆ, KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO NGOÀI JSON.`;

      const userMessage = `Phân tích chi tiết ngữ pháp câu sau cho người học N5:
- Câu tiếng Nhật: "${cleanSent}"
- Phiên âm: "${reading || ''}"
- Nghĩa tiếng Việt: "${vietnamese || ''}"`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          responseMimeType: 'application/json',
        },
      };

      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok && (response.status === 404 || response.status === 400)) {
        const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        response = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          let cleaned = rawText.trim();
          if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          const parsed: GrammarAnalysis = JSON.parse(cleaned);
          setCachedAnalysis(cleanSent, parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[AI Grammar] Gemini API call failed, falling back to smart rules:', err);
    }
  }

  // 4. Fallback to smart rule-based analysis
  const fallback = generateSmartRuleBasedAnalysis(cleanSent, reading, vietnamese);
  setCachedAnalysis(cleanSent, fallback);
  return fallback;
}
