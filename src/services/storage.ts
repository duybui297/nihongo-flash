import type { Flashcard, Deck, AppData } from '../types/flashcard';
import { api } from './api';
import { createSeedData } from '../../shared/seed';

const defaultSeed = createSeedData();
export const INITIAL_DECKS: Deck[] = defaultSeed.decks;
export const INITIAL_CARDS: Flashcard[] = defaultSeed.cards;

const STORAGE_KEY_CARDS = 'nihongo_flashcards_v2';
const STORAGE_KEY_DECKS = 'nihongo_decks_v2';

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

function getLocalCards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CARDS);
    if (!raw) return INITIAL_CARDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return cleanLegacySeedVideos(parsed);
    }
    return INITIAL_CARDS;
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
    const raw = localStorage.getItem(STORAGE_KEY_DECKS);
    if (!raw) return INITIAL_DECKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DECKS;
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
    setLocalCards(data.cards);
    setLocalDecks(data.decks);
    return {
      cards: data.cards,
      decks: data.decks,
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
