import type { Flashcard } from './types';

/** Generates a collision-safe id such as `card-1f3a9c2e`. */
export function createId(prefix: string): string {
  const uuid =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${uuid}`;
}

/** Case-insensitive search across the text fields of a card. */
export function matchesSearch(card: Flashcard, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [card.title, card.japanese, card.reading, card.meaning, card.description].some((field) =>
    field?.toLowerCase().includes(q),
  );
}
