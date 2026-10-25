export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Khác';

export type CardCategory = 'Từ vựng' | 'Kanji' | 'Ngữ pháp' | 'Giao tiếp' | 'Thành ngữ' | 'Khác';

export type StudyStatus = 'new' | 'learning' | 'mastered';

export interface ExampleSentence {
  id: string;
  japanese: string;
  reading?: string;
  vietnamese: string;
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
  imageUrl?: string;             // Ảnh minh họa (base64 hoặc URL)
  videoUrl?: string;             // Video minh họa (base64 mp4/webm hoặc URL)
  thumbnailUrl?: string;         // Thumbnail đại diện ngoài danh sách (từ ảnh/video hoặc riêng)
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

export interface StudySessionStats {
  totalReviewed: number;
  rememberedCount: number;
  forgottenCount: number;
  learningCount: number;
}
