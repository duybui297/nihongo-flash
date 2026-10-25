import { CARD_CATEGORIES, DEFAULT_DECK_COLOR, DEFAULT_DECK_ICON, JLPT_LEVELS, STUDY_STATUSES } from '../shared/constants';
import { createId } from '../shared/utils';
import type {
  CardCategory,
  Deck,
  DeckInput,
  ExampleSentence,
  Flashcard,
  FlashcardInput,
  JLPTLevel,
  StudyStatus,
} from '../shared/types';
import { badRequest } from './http';

type Body = Record<string, unknown>;

const asString = (value: unknown, maxLength = 20_000): string =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const has = (body: Body, key: string) => Object.prototype.hasOwnProperty.call(body, key);

const JLPT_VALUES = new Set<string>(JLPT_LEVELS.map((l) => l.value));
const CATEGORY_VALUES = new Set<string>(CARD_CATEGORIES.map((c) => c.value));
const STATUS_VALUES = new Set<string>(STUDY_STATUSES);

export function isStudyStatus(value: unknown): value is StudyStatus {
  return typeof value === 'string' && STATUS_VALUES.has(value);
}

function parseExamples(value: unknown): ExampleSentence[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((ex): ex is Body => typeof ex === 'object' && ex !== null)
    .map((ex) => ({
      id: asString(ex.id, 100) || createId('ex'),
      japanese: asString(ex.japanese, 1000),
      reading: asString(ex.reading, 1000) || undefined,
      vietnamese: asString(ex.vietnamese, 1000),
    }))
    .filter((ex) => ex.japanese || ex.vietnamese);
}

/**
 * Picks only known, editable fields from a request body (prevents mass-assignment of
 * id/status/reviewCount/etc.). With `partial`, absent fields are left out.
 */
export function parseCardInput(body: Body, partial: boolean): Partial<FlashcardInput> {
  const input: Partial<FlashcardInput> = {};
  const want = (key: keyof FlashcardInput) => !partial || has(body, key);

  if (want('deckId')) input.deckId = asString(body.deckId, 200);
  if (want('title')) input.title = asString(body.title, 500);
  if (want('japanese')) input.japanese = asString(body.japanese, 500);
  if (want('reading')) input.reading = asString(body.reading, 500);
  if (want('meaning')) input.meaning = asString(body.meaning, 1000);
  if (want('description')) input.description = asString(body.description);
  if (want('jlpt')) {
    input.jlpt = (JLPT_VALUES.has(body.jlpt as string) ? body.jlpt : 'N5') as JLPTLevel;
  }
  if (want('category')) {
    input.category = (CATEGORY_VALUES.has(body.category as string) ? body.category : 'Từ vựng') as CardCategory;
  }
  if (want('examples')) input.examples = parseExamples(body.examples);
  // Media fields are normalised later by persistCardMedia (URL validation + data URL → file).
  for (const key of ['imageUrl', 'videoUrl', 'thumbnailUrl'] as const) {
    if (has(body, key)) input[key] = body[key] as string | undefined;
  }

  if (!partial && !input.title && !input.japanese) {
    throw badRequest('Thiếu thông tin tiêu đề hoặc chữ Hán');
  }
  if (partial && has(body, 'title') && has(body, 'japanese') && !input.title && !input.japanese) {
    throw badRequest('Thiếu thông tin tiêu đề hoặc chữ Hán');
  }
  return input;
}

export function parseDeckInput(body: Body, partial: boolean): Partial<DeckInput> {
  const input: Partial<DeckInput> = {};
  const want = (key: keyof DeckInput) => !partial || has(body, key);

  if (want('name')) {
    input.name = asString(body.name, 200);
    if (!input.name) throw badRequest('Tên bộ thẻ là bắt buộc');
  }
  if (want('description')) input.description = asString(body.description, 1000);
  if (want('color')) {
    const color = asString(body.color, 20);
    input.color = /^#[0-9a-f]{3,8}$/i.test(color) ? color : DEFAULT_DECK_COLOR;
  }
  if (want('icon')) input.icon = asString(body.icon, 16) || DEFAULT_DECK_ICON;
  return input;
}

/** Validates a full backup file. Unknown fields are dropped, missing ones get defaults. */
export function parseBackup(body: Body): { decks: Deck[]; cards: Flashcard[] } {
  if (!Array.isArray(body.decks) || !Array.isArray(body.cards)) {
    throw badRequest('Dữ liệu sao lưu không hợp lệ. Cần có mảng decks và cards.');
  }
  const now = new Date().toISOString();

  const decks: Deck[] = (body.decks as Body[]).map((raw) => ({
    id: asString(raw.id, 200) || createId('deck'),
    createdAt: asString(raw.createdAt, 50) || now,
    ...(parseDeckInput(raw, false) as DeckInput),
  }));
  if (decks.length === 0) throw badRequest('File sao lưu phải có ít nhất 1 bộ thẻ.');

  const deckIds = new Set(decks.map((d) => d.id));
  const cards: Flashcard[] = (body.cards as Body[]).map((raw) => {
    const input = parseCardInput(raw, false) as FlashcardInput;
    return {
      ...input,
      id: asString(raw.id, 200) || createId('card'),
      deckId: deckIds.has(input.deckId) ? input.deckId : decks[0].id,
      title: input.title || input.japanese,
      japanese: input.japanese || input.title,
      status: isStudyStatus(raw.status) ? raw.status : 'new',
      reviewCount: typeof raw.reviewCount === 'number' ? raw.reviewCount : 0,
      lastReviewedAt: asString(raw.lastReviewedAt, 50) || undefined,
      createdAt: asString(raw.createdAt, 50) || now,
      updatedAt: asString(raw.updatedAt, 50) || now,
    };
  });

  return { decks, cards };
}
