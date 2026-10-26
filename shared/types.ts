/**
 * Domain types shared by the Express server and the React client.
 */

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Khác';

export type CardCategory = 'Từ vựng' | 'Kanji' | 'Ngữ pháp' | 'Giao tiếp' | 'Thành ngữ' | 'Khác';

export type StudyStatus = 'new' | 'learning' | 'mastered';

export interface ExampleSentence {
  id: string;
  japanese: string;
  reading?: string;
  vietnamese: string;
  audioUrl?: string;             // Audio giọng đọc AI (Cloudinary MP3 URL)
}

export interface Flashcard {
  id: string;
  deckId: string;
  title: string;                 // Tiêu đề hiển thị ở danh sách
  japanese: string;              // Kanji hoặc từ vựng chính (ví dụ: 桜, 食べる)
  reading: string;               // Cách đọc (さくら, taberu)
  meaning: string;               // Nghĩa tiếng Việt (Hoa anh đào, Ăn)
  jlpt: JLPTLevel;               // Cấp độ JLPT
  category: CardCategory;        // Loại thẻ
  description: string;           // Khung mô tả chi tiết (ngữ cảnh, mẹo nhớ, bộ thủ, cấu trúc)
  imageUrl?: string;             // Ảnh minh họa (URL)
  videoUrl?: string;             // Video minh họa (URL)
  thumbnailUrl?: string;         // Thumbnail đại diện ngoài danh sách
  audioUrl?: string;             // Audio giọng đọc AI chất lượng cao (MP3 URL)
  examples: ExampleSentence[];   // Các câu ví dụ thực tế
  status: StudyStatus;           // Trạng thái học tập
  reviewCount: number;           // Số lần đã ôn
  lastReviewedAt?: string;       // Lần ôn gần nhất
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  createdAt: string;
}

/** Editable card fields sent by the client. Server owns id/timestamps/review stats. */
export type FlashcardInput = Pick<
  Flashcard,
  | 'deckId'
  | 'title'
  | 'japanese'
  | 'reading'
  | 'meaning'
  | 'jlpt'
  | 'category'
  | 'description'
  | 'imageUrl'
  | 'videoUrl'
  | 'thumbnailUrl'
  | 'audioUrl'
  | 'examples'
>;

/** Editable deck fields sent by the client. */
export type DeckInput = Pick<Deck, 'name' | 'description' | 'color' | 'icon'>;

export interface AppData {
  decks: Deck[];
  cards: Flashcard[];
}

export interface DatabaseSchema extends AppData {
  version: string;
  updatedAt: string;
}

export interface StorageStats {
  totalBytes: number;
  fileCount: number;
  freeBytes: number | null;
  maxFileBytes: number;
}

export interface UploadResult {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}
