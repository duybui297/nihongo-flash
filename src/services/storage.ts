import type { Flashcard, Deck, AppData } from '../types/flashcard';
import { api } from './api';
import { createSeedData } from '../../shared/seed';

const defaultSeed = createSeedData();
export const INITIAL_DECKS: Deck[] = defaultSeed.decks;
export const INITIAL_CARDS: Flashcard[] = defaultSeed.cards;

/**
 * Loads data from server persistence.
 * Server is the single source of truth.
 */
export async function initializeStorage(): Promise<{
  cards: Flashcard[];
  decks: Deck[];
  isServerConnected: boolean;
}> {
  try {
    const data = await api.getInitialData();
    return {
      cards: data.cards,
      decks: data.decks,
      isServerConnected: true,
    };
  } catch (err) {
    console.warn('[Storage] Could not reach server, using default sample data:', err);
    return {
      cards: INITIAL_CARDS,
      decks: INITIAL_DECKS,
      isServerConnected: false,
    };
  }
}

export async function saveFlashcard(card: Flashcard): Promise<Flashcard> {
  return api.saveFlashcard(card);
}

export async function deleteFlashcard(cardId: string): Promise<void> {
  return api.deleteFlashcard(cardId);
}

export async function saveDeck(deck: Deck): Promise<Deck> {
  const isExisting = Boolean(deck.id && !deck.id.startsWith('temp-') && !deck.id.startsWith('new-'));
  if (isExisting) {
    try {
      return await api.updateDeck(deck.id, deck);
    } catch {
      // If updating failed with 404, fallback to create
      return api.createDeck(deck);
    }
  }
  return api.createDeck(deck);
}

export async function deleteDeck(deckId: string): Promise<{ success: boolean; fallbackDeckId: string }> {
  return api.deleteDeck(deckId);
}

export async function resetAllData(): Promise<AppData> {
  return api.resetToSample();
}

export async function clearAllData(): Promise<AppData> {
  return api.clearAllData();
}

export async function exportAllData(): Promise<string> {
  return api.exportBackup();
}

export async function importData(jsonData: string): Promise<AppData> {
  await api.importBackup(jsonData);
  return api.getInitialData();
}
