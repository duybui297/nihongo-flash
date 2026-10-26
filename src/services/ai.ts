import type { FlashcardInput, ExampleSentence, JLPTLevel, CardCategory } from '../types/flashcard';
import { createId } from '../../shared/utils';

const STORAGE_KEY_GEMINI = 'nihonflash_gemini_api_key';

export function getGeminiApiKey(): string {
  try {
    const local = localStorage.getItem(STORAGE_KEY_GEMINI);
    if (local && local.trim()) return local.trim();
  } catch {
    // Ignore
  }
  return (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || '';
}

export function setGeminiApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
  } catch (err) {
    console.warn('Failed to save Gemini key:', err);
  }
}

export function clearGeminiApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_GEMINI);
  } catch {
    // Ignore
  }
}

export interface AIGeneratedCardResult {
  title: string;
  japanese: string;
  reading: string;
  meaning: string;
  jlpt: JLPTLevel;
  category: CardCategory;
  description: string;
  examples: ExampleSentence[];
  suggestedImageQuery?: string;
}

export async function generateFlashcardWithGemini(
  inputPrompt: string,
  customApiKey?: string
): Promise<AIGeneratedCardResult> {
  const apiKey = (customApiKey || getGeminiApiKey()).trim();
  if (!apiKey) {
    throw new Error(
      'Chưa cấu hình Google Gemini API Key. Vui lòng bấm biểu tượng cài đặt AI để nhập khóa (Hoàn toàn miễn phí tại aistudio.google.com).'
    );
  }

  const systemInstruction = `Bạn là một chuyên gia ngôn ngữ Nhật Bản và giáo viên luyện thi JLPT hàng đầu. 
Nhiệm vụ của bạn là nhận từ khóa đầu vào (có thể là một từ Kanji, Hiragana, mẫu ngữ pháp, hoặc tiếng Việt) và tạo ra nội dung Flashcard học tiếng Nhật hoàn chỉnh, chính xác, sâu sắc theo định dạng JSON.

Quy tắc xuất bản:
1. "title": Tiêu đề súc tích hiển thị ở danh sách (VD: "桜 (Sakura) - Hoa anh đào" hoặc "気をつける - Cẩn thận").
2. "japanese": Chữ Hán hoặc từ vựng/mẫu ngữ pháp gốc (VD: 桜, 食べる, 気をつける, 〜わけにはいかない).
3. "reading": Cách đọc Furigana bằng Hiragana/Katakana chuẩn (VD: さくら, たべる, きをつける).
4. "meaning": Nghĩa tiếng Việt chuẩn xác, tự nhiên, ngắn gọn.
5. "jlpt": Phải là 1 trong các giá trị sau: "N5", "N4", "N3", "N2", "N1", "Khác".
6. "category": Phải là 1 trong các giá trị sau: "Từ vựng", "Kanji", "Ngữ pháp", "Giao tiếp", "Thành ngữ", "Khác".
7. "description": Phân tích chuyên sâu dạng Markdown bao gồm:
   - Phân tích chữ Hán (Hán Việt, bộ thủ, cấu tạo ý nghĩa).
   - Ngữ cảnh dùng phổ biến & sắc thái biểu đạt.
   - 💡 Mẹo ghi nhớ độc đáo giúp nhớ lâu.
   - Từ đồng nghĩa hoặc cặp từ hay gây nhầm lẫn.
8. "examples": Mảng gồm chính xác 2 đến 3 câu ví dụ thực tế, tự nhiên. Mỗi câu gồm:
   - "japanese": Câu tiếng Nhật có chữ Hán.
   - "reading": Phiên âm toàn bộ câu bằng Hiragana.
   - "vietnamese": Bản dịch tiếng Việt sát nghĩa và tự nhiên.
9. "suggestedImageQuery": Từ khóa tiếng Anh ngắn (2-4 từ) để tìm ảnh minh họa phù hợp (VD: "cherry blossom sakura", "careful attention").

CHỈ TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON HỢP LỆ, KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO BÊN NGOÀI.`;

  const userMessage = `Hãy tạo thẻ Flashcard học tiếng Nhật chuẩn xác cho từ/nội dung sau: "${inputPrompt.trim()}"`;

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

  // Fallback to gemini-1.5-flash if 2.5-flash is unavailable for this key
  if (!response.ok && (response.status === 404 || response.status === 400)) {
    const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    response = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg = errorData?.error?.message || `Yêu cầu Gemini AI thất bại (${response.status})`;
    if (response.status === 400 && msg.includes('API_KEY_INVALID')) {
      throw new Error('Khóa Gemini API Key không hợp lệ. Vui lòng kiểm tra lại tại aistudio.google.com.');
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini AI không trả về nội dung nào.');
  }

  // Parse JSON
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate and normalize
  const validJlpt = ['N5', 'N4', 'N3', 'N2', 'N1', 'Khác'].includes(parsed.jlpt)
    ? (parsed.jlpt as JLPTLevel)
    : 'N5';

  const validCategory = [
    'Từ vựng',
    'Kanji',
    'Ngữ pháp',
    'Giao tiếp',
    'Thành ngữ',
    'Khác',
  ].includes(parsed.category)
    ? (parsed.category as CardCategory)
    : 'Từ vựng';

  const examples: ExampleSentence[] = Array.isArray(parsed.examples)
    ? parsed.examples.map((ex: any) => ({
        id: createId('ex'),
        japanese: String(ex.japanese || ''),
        reading: ex.reading ? String(ex.reading) : undefined,
        vietnamese: String(ex.vietnamese || ''),
      }))
    : [];

  return {
    title: parsed.title || `${parsed.japanese} - ${parsed.meaning}`,
    japanese: parsed.japanese || inputPrompt,
    reading: parsed.reading || '',
    meaning: parsed.meaning || '',
    jlpt: validJlpt,
    category: validCategory,
    description: parsed.description || '',
    examples,
    suggestedImageQuery: parsed.suggestedImageQuery,
  };
}
