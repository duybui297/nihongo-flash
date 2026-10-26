import type { Flashcard, Deck, AppData } from '../types/flashcard';
import { api } from './api';
import { createSeedData } from '../../shared/seed';

const defaultSeed = createSeedData();
export const INITIAL_DECKS: Deck[] = defaultSeed.decks;
export const INITIAL_CARDS: Flashcard[] = defaultSeed.cards;

const STORAGE_KEY_CARDS = 'nihongo_flashcards_v3';
const STORAGE_KEY_DECKS = 'nihongo_decks_v3';
const LEGACY_KEY_CARDS = 'nihongo_flashcards_v2';
const LEGACY_KEY_DECKS = 'nihongo_decks_v2';

function cleanLegacySeedVideos(cards: Flashcard[]): Flashcard[] {
  let changed = false;
  const cleaned = cards.map((c) => {
    // If the card has a dummy seed mixkit video, clean it out so default is image
    if (c.videoUrl && c.videoUrl.includes('mixkit.co')) {
      changed = true;
      const { videoUrl: _, ...rest } = c;
      return { ...rest, videoUrl: undefined };
    }
    return c;
  });
  if (changed) {
    setLocalCards(cleaned);
  }
  return cleaned;
}

/** Automatically merges any missing default seed items into the local collection */
function syncItemsWithSeed<T extends { id: string }>(
  currentItems: T[],
  seedItems: T[],
  saveFn: (items: T[]) => void
): T[] {
  const existingIds = new Set(currentItems.map((item) => item.id));
  const missingItems = seedItems.filter((item) => !existingIds.has(item.id));
  if (missingItems.length > 0) {
    const merged = [...currentItems, ...missingItems];
    saveFn(merged);
    return merged;
  }
  return currentItems;
}

function getLocalCards(): Flashcard[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY_CARDS);
    let cards: Flashcard[] | null = null;

    if (!raw) {
      // Check for legacy v2 data to migrate
      const legacyRaw = localStorage.getItem(LEGACY_KEY_CARDS);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cards = cleanLegacySeedVideos(parsed);
          }
        } catch {
          cards = null;
        }
      }
    } else {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cards = cleanLegacySeedVideos(parsed);
        }
      } catch {
        cards = null;
      }
    }

    if (!cards || cards.length === 0) {
      setLocalCards(INITIAL_CARDS);
      return INITIAL_CARDS;
    }

    // Always merge in any newly added seed cards (e.g. 90 JLPT N5 Kanji cards)
    return syncItemsWithSeed(cards, INITIAL_CARDS, setLocalCards);
  } catch {
    return INITIAL_CARDS;
  }
}

function setLocalCards(cards: Flashcard[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
  } catch (err) {
    console.warn('[Storage] Failed to save cards to localStorage:', err);
  }
}

function getLocalDecks(): Deck[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY_DECKS);
    let decks: Deck[] | null = null;

    if (!raw) {
      // Check for legacy v2 data to migrate
      const legacyRaw = localStorage.getItem(LEGACY_KEY_DECKS);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            decks = parsed;
          }
        } catch {
          decks = null;
        }
      }
    } else {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          decks = parsed;
        }
      } catch {
        decks = null;
      }
    }

    if (!decks || decks.length === 0) {
      setLocalDecks(INITIAL_DECKS);
      return INITIAL_DECKS;
    }

    // Always merge in any newly added seed decks (e.g. deck-kanji-n5-jlpt)
    return syncItemsWithSeed(decks, INITIAL_DECKS, setLocalDecks);
  } catch {
    return INITIAL_DECKS;
  }
}

function setLocalDecks(decks: Deck[]) {
  try {
    localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
  } catch (err) {
    console.warn('[Storage] Failed to save decks to localStorage:', err);
  }
}

/**
 * Loads data from server persistence with graceful fallback to localStorage.
 */
export async function initializeStorage(): Promise<{
  cards: Flashcard[];
  decks: Deck[];
  isServerConnected: boolean;
}> {
  try {
    const data = await api.getInitialData();
    // Cache to localStorage for offline resilience
    const mergedCards = syncItemsWithSeed(data.cards, INITIAL_CARDS, () => {});
    const mergedDecks = syncItemsWithSeed(data.decks, INITIAL_DECKS, () => {});
    setLocalCards(mergedCards);
    setLocalDecks(mergedDecks);
    return {
      cards: mergedCards,
      decks: mergedDecks,
      isServerConnected: true,
    };
  } catch (err) {
    console.warn('[Storage] Could not reach backend server, falling back to local client storage:', err);
    return {
      cards: getLocalCards(),
      decks: getLocalDecks(),
      isServerConnected: false,
    };
  }
}

export async function saveFlashcard(card: Flashcard): Promise<Flashcard> {
  try {
    const saved = await api.saveFlashcard(card);
    const local = getLocalCards();
    const idx = local.findIndex((c) => c.id === saved.id);
    if (idx >= 0) local[idx] = saved;
    else local.push(saved);
    setLocalCards(local);
    return saved;
  } catch {
    // Offline/client fallback
    const local = getLocalCards();
    const now = new Date().toISOString();
    const cardToSave: Flashcard = {
      ...card,
      id: card.id || `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: card.createdAt || now,
      updatedAt: now,
    };
    const idx = local.findIndex((c) => c.id === cardToSave.id);
    if (idx >= 0) local[idx] = cardToSave;
    else local.push(cardToSave);
    setLocalCards(local);
    return cardToSave;
  }
}

export async function deleteFlashcard(cardId: string): Promise<void> {
  try {
    await api.deleteFlashcard(cardId);
  } catch {
    // Continue to update local cache
  }
  const local = getLocalCards().filter((c) => c.id !== cardId);
  setLocalCards(local);
}

export async function saveDeck(deck: Deck): Promise<Deck> {
  const isExisting = Boolean(deck.id && !deck.id.startsWith('temp-') && !deck.id.startsWith('new-'));
  try {
    let saved: Deck;
    if (isExisting) {
      try {
        saved = await api.updateDeck(deck.id, deck);
      } catch {
        saved = await api.createDeck(deck);
      }
    } else {
      saved = await api.createDeck(deck);
    }
    const local = getLocalDecks();
    const idx = local.findIndex((d) => d.id === saved.id);
    if (idx >= 0) local[idx] = saved;
    else local.push(saved);
    setLocalDecks(local);
    return saved;
  } catch {
    // Offline/client fallback
    const local = getLocalDecks();
    const now = new Date().toISOString();
    const deckToSave: Deck = {
      ...deck,
      id: deck.id && !deck.id.startsWith('temp-') ? deck.id : `deck-${Date.now()}`,
      color: deck.color || 'from-rose-500 to-red-600',
      createdAt: deck.createdAt || now,
    };
    const idx = local.findIndex((d) => d.id === deckToSave.id);
    if (idx >= 0) local[idx] = deckToSave;
    else local.push(deckToSave);
    setLocalDecks(local);
    return deckToSave;
  }
}

export async function deleteDeck(deckId: string): Promise<{ success: boolean; fallbackDeckId: string }> {
  let fallbackId = 'default';
  try {
    const res = await api.deleteDeck(deckId);
    fallbackId = res.fallbackDeckId;
  } catch {
    const currentDecks = getLocalDecks();
    const other = currentDecks.find((d) => d.id !== deckId);
    fallbackId = other ? other.id : 'default';
  }

  // Update local storage
  const remainingDecks = getLocalDecks().filter((d) => d.id !== deckId);
  setLocalDecks(remainingDecks.length > 0 ? remainingDecks : INITIAL_DECKS);

  const updatedCards = getLocalCards().map((c) =>
    c.deckId === deckId ? { ...c, deckId: fallbackId } : c
  );
  setLocalCards(updatedCards);

  return { success: true, fallbackDeckId: fallbackId };
}

export async function resetAllData(): Promise<AppData> {
  try {
    const data = await api.resetToSample();
    setLocalCards(data.cards);
    setLocalDecks(data.decks);
    return data;
  } catch {
    setLocalCards(INITIAL_CARDS);
    setLocalDecks(INITIAL_DECKS);
    return {
      cards: INITIAL_CARDS,
      decks: INITIAL_DECKS,
    };
  }
}

export async function clearAllData(): Promise<AppData> {
  try {
    const data = await api.clearAllData();
    setLocalCards(data.cards);
    setLocalDecks(data.decks);
    return data;
  } catch {
    const defaultDeck: Deck = {
      id: 'default',
      name: 'Mặc định',
      description: 'Bộ thẻ mặc định',
      color: 'from-rose-500 to-red-600',
      createdAt: new Date().toISOString(),
    };
    setLocalCards([]);
    setLocalDecks([defaultDeck]);
    return {
      cards: [],
      decks: [defaultDeck],
    };
  }
}

export async function exportAllData(): Promise<string> {
  try {
    return await api.exportBackup();
  } catch {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      decks: getLocalDecks(),
      flashcards: getLocalCards(),
    };
    return JSON.stringify(backup, null, 2);
  }
}

export async function importData(jsonData: string): Promise<AppData> {
  try {
    await api.importBackup(jsonData);
    return await api.getInitialData();
  } catch {
    const parsed = JSON.parse(jsonData);
    const importedCards = Array.isArray(parsed.flashcards) ? parsed.flashcards : [];
    const importedDecks = Array.isArray(parsed.decks) ? parsed.decks : INITIAL_DECKS;
    setLocalCards(importedCards);
    setLocalDecks(importedDecks);
    return {
      cards: importedCards,
      decks: importedDecks,
    };
  }
}
