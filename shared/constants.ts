import type { CardCategory, JLPTLevel, StudyStatus } from './types';

export const DB_VERSION = '1.0';

/** Max size for a single uploaded image/video. */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

/** Only these MIME types may be uploaded (SVG/HTML are excluded to prevent stored XSS). */
export const ALLOWED_UPLOAD_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
  'video/quicktime': '.mov',
};

export const UPLOAD_ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
export const UPLOAD_ACCEPT_VIDEO = 'video/mp4,video/webm,video/ogg,video/quicktime';

export const JLPT_LEVELS: { value: JLPTLevel; label: string }[] = [
  { value: 'N5', label: 'N5 (Sơ cấp 1)' },
  { value: 'N4', label: 'N4 (Sơ cấp 2)' },
  { value: 'N3', label: 'N3 (Trung cấp)' },
  { value: 'N2', label: 'N2 (Thượng cấp)' },
  { value: 'N1', label: 'N1 (Cao cấp)' },
  { value: 'Khác', label: 'Khác' },
];

export const CARD_CATEGORIES: { value: CardCategory; label: string }[] = [
  { value: 'Từ vựng', label: 'Từ vựng (Tango)' },
  { value: 'Kanji', label: 'Chữ Hán (Kanji)' },
  { value: 'Ngữ pháp', label: 'Ngữ pháp (Bunpou)' },
  { value: 'Giao tiếp', label: 'Giao tiếp (Kaiwa)' },
  { value: 'Thành ngữ', label: 'Thành ngữ / Quán dụng ngữ' },
  { value: 'Khác', label: 'Khác' },
];

export const STUDY_STATUSES: StudyStatus[] = ['new', 'learning', 'mastered'];

export const STATUS_LABELS: Record<StudyStatus, string> = {
  new: 'Chưa học',
  learning: 'Đang học',
  mastered: 'Đã thuộc',
};

/** Cycle used when clicking a status badge in the library. */
export const NEXT_STATUS: Record<StudyStatus, StudyStatus> = {
  new: 'learning',
  learning: 'mastered',
  mastered: 'new',
};

export const DEFAULT_DECK_COLOR = '#ef4444';
export const DEFAULT_DECK_ICON = '🌸';

export const DECK_COLOR_PRESETS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#0284c7', // Sky
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export const DECK_ICON_PRESETS = ['🌸', '🗻', '🍵', '🍱', '⛩️', '🏮', '🏯', '🎌', '🐱', '📖', '🎯', '✨'];
