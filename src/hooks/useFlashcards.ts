import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Flashcard, Deck, StudyStatus } from '../types/flashcard';
import { NEXT_STATUS } from '../types/flashcard';
import {
  initializeStorage,
  saveFlashcard as apiSaveCard,
  deleteFlashcard as apiDeleteCard,
  saveDeck as apiSaveDeck,
  deleteDeck as apiDeleteDeck,
} from '../services/storage';
import { api } from '../services/api';
import { readFileAsDataUrl, optimizeImageDataUrl } from '../utils/media';

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'library' | 'study' | 'quiz'>('library');
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Target card when starting study mode from a specific card
  const [studyTargetCardId, setStudyTargetCardId] = useState<string | undefined>(undefined);

  // Initial load
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setIsLoading(true);
        const { cards: initialCards, decks: initialDecks, isServerConnected: connected } = await initializeStorage();
        if (!mounted) return;
        setCards(initialCards);
        setDecks(initialDecks);
        setIsServerConnected(connected);
      } catch (err) {
        console.error('Failed to load flashcard storage:', err);
        if (mounted) setError('Không thể kết nối đến máy chủ lưu trữ.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered cards for currently selected deck
  const activeDeckCards = useMemo(() => {
    if (selectedDeckId === 'all') return cards;
    return cards.filter((c) => c.deckId === selectedDeckId);
  }, [cards, selectedDeckId]);

  // Flashcard Actions
  const handleSaveCard = useCallback(async (cardToSave: Flashcard) => {
    try {
      const saved = await apiSaveCard(cardToSave);
      setCards((prev) => {
        const index = prev.findIndex((c) => c.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err) {
      console.error('Failed to save flashcard:', err);
      throw err;
    }
  }, []);

  const handleDeleteCard = useCallback(async (cardId: string) => {
    try {
      await apiDeleteCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      console.error('Failed to delete flashcard:', err);
      throw err;
    }
  }, []);

  const handleToggleStatus = useCallback(async (card: Flashcard) => {
    const nextStatus = NEXT_STATUS[card.status];
    try {
      const updated = await api.updateCardStatus(card.id, nextStatus);
      setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)));
    } catch {
      // Optimistic local update fallback
      const updated: Flashcard = {
        ...card,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      };
      setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)));
    }
  }, []);

  const handleUpdateCardStatus = useCallback(async (cardId: string, newStatus: StudyStatus) => {
    try {
      const updated = await api.updateCardStatus(cardId, newStatus);
      setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
    } catch (err) {
      console.error('Failed to update card status:', err);
    }
  }, []);

  const handleQuickUploadImage = useCallback(async (card: Flashcard, file: File) => {
    try {
      let imageUrl = '';
      try {
        const res = await api.uploadFile(file);
        imageUrl = res.url;
      } catch {
        const raw = await readFileAsDataUrl(file);
        imageUrl = await optimizeImageDataUrl(raw, 1000, 1000, 0.85);
      }
      const updated: Flashcard = {
        ...card,
        imageUrl,
        thumbnailUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      };
      await handleSaveCard(updated);
    } catch (err) {
      console.error('Lỗi tải ảnh nhanh:', err);
      throw err;
    }
  }, [handleSaveCard]);

  // Deck Actions
  const handleSaveDeck = useCallback(async (deckToSave: Deck) => {
    try {
      const saved = await apiSaveDeck(deckToSave);
      setDecks((prev) => {
        const index = prev.findIndex((d) => d.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [...prev, saved];
      });
      return saved;
    } catch (err) {
      console.error('Failed to save deck:', err);
      throw err;
    }
  }, []);

  const handleDeleteDeck = useCallback(async (deckId: string) => {
    try {
      const res = await apiDeleteDeck(deckId);
      const fallbackId = res.fallbackDeckId;

      setDecks((prev) => prev.filter((d) => d.id !== deckId));
      setCards((prev) =>
        prev.map((c) => (c.deckId === deckId ? { ...c, deckId: fallbackId } : c))
      );

      setSelectedDeckId((prev) => (prev === deckId ? 'all' : prev));
    } catch (err) {
      console.error('Failed to delete deck:', err);
      throw err;
    }
  }, []);

  const handleDataRestored = useCallback((restoredCards: Flashcard[], restoredDecks: Deck[]) => {
    setCards(restoredCards);
    setDecks(restoredDecks);
    setSelectedDeckId('all');
  }, []);

  const startStudy = useCallback((card?: Flashcard) => {
    setStudyTargetCardId(card?.id);
    setActiveTab('study');
  }, []);

  return {
    cards,
    decks,
    selectedDeckId,
    setSelectedDeckId,
    activeTab,
    setActiveTab,
    isServerConnected,
    isLoading,
    error,
    studyTargetCardId,
    setStudyTargetCardId,
    activeDeckCards,
    handleSaveCard,
    handleDeleteCard,
    handleToggleStatus,
    handleUpdateCardStatus,
    handleQuickUploadImage,
    handleSaveDeck,
    handleDeleteDeck,
    handleDataRestored,
    startStudy,
  };
}
