/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flashcard, Deck, StudyStatus } from './types/flashcard';
import { 
  initializeStorage, 
  saveFlashcard, 
  deleteFlashcard, 
  saveDeck, 
  deleteDeck 
} from './services/storage';
import { Header } from './components/Header';
import { FlashcardGrid } from './components/FlashcardGrid';
import { FlashcardModal } from './components/FlashcardModal';
import { StudyMode } from './components/StudyMode';
import { QuizMode } from './components/QuizMode';
import { DeckManagerModal } from './components/DeckManagerModal';
import { BackupModal } from './components/BackupModal';
import { Loader2 } from 'lucide-react';
import { api } from './services/api';
import { readFileAsDataUrl, optimizeImageDataUrl } from './utils/media';

export default function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'library' | 'study' | 'quiz'>('library');
  
  // Modals state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  
  // Specific study target
  const [studyTargetCardId, setStudyTargetCardId] = useState<string | undefined>(undefined);

  // Server persistence state
  const [isServerConnected, setIsServerConnected] = useState(true);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from Server Persistence
  useEffect(() => {
    async function loadData() {
      try {
        const { cards: storedCards, decks: storedDecks, isServerConnected: connected } = await initializeStorage();
        setCards(storedCards);
        setDecks(storedDecks);
        setIsServerConnected(connected);
      } catch (err) {
        console.error('Failed to load storage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter cards by selected deck
  const activeCards = selectedDeckId === 'all'
    ? cards
    : cards.filter((c) => c.deckId === selectedDeckId);

  // Save (Create or Update) Flashcard
  const handleSaveCard = async (savedCard: Flashcard) => {
    await saveFlashcard(savedCard);
    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === savedCard.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedCard;
        return next;
      }
      return [savedCard, ...prev];
    });
  };

  // Delete Flashcard
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá thẻ này không?')) return;
    await deleteFlashcard(cardId);
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Toggle card learning status
  const handleToggleStatus = async (card: Flashcard) => {
    const nextStatusMap: Record<StudyStatus, StudyStatus> = {
      new: 'learning',
      learning: 'mastered',
      mastered: 'new',
    };
    const updated: Flashcard = {
      ...card,
      status: nextStatusMap[card.status],
      updatedAt: new Date().toISOString(),
    };
    await saveFlashcard(updated);
    setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)));
  };

  // Update card status during StudyMode
  const handleUpdateCardStatus = async (cardId: string, newStatus: StudyStatus) => {
    const target = cards.find((c) => c.id === cardId);
    if (!target) return;

    const updated: Flashcard = {
      ...target,
      status: newStatus,
      reviewCount: (target.reviewCount || 0) + 1,
      lastReviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveFlashcard(updated);
    setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
  };

  // Start study mode for a single card or current deck
  const handleStudyCard = (card: Flashcard) => {
    setStudyTargetCardId(card.id);
    setActiveTab('study');
  };

  // Open Edit Card Modal
  const handleEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  // Open Add Card Modal
  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  // Quick image upload directly from card thumbnail
  const handleQuickUploadImage = async (card: Flashcard, file: File) => {
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
    }
  };

  // Deck CRUD
  const handleSaveDeck = async (deck: Deck) => {
    await saveDeck(deck);
    setDecks((prev) => {
      const idx = prev.findIndex((d) => d.id === deck.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = deck;
        return next;
      }
      return [...prev, deck];
    });
  };

  const handleDeleteDeck = async (deckId: string) => {
    await deleteDeck(deckId);
    const remainingDecks = decks.filter((d) => d.id !== deckId);
    setDecks(remainingDecks);
    // Reassign cards in this deck to the first available deck
    const fallbackDeckId = remainingDecks[0]?.id || 'deck-n5-basic';
    const updatedCards = cards.map((c) => {
      if (c.deckId === deckId) {
        const moved = { ...c, deckId: fallbackDeckId };
        saveFlashcard(moved);
        return moved;
      }
      return c;
    });
    setCards(updatedCards);
    if (selectedDeckId === deckId) {
      setSelectedDeckId('all');
    }
  };

  // Restored data callback
  const handleDataRestored = (restoredCards: Flashcard[], restoredDecks: Deck[]) => {
    setCards(restoredCards);
    setDecks(restoredDecks);
    setSelectedDeckId('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
        <p className="text-sm font-medium text-stone-600">Đang khởi tạo NihonFlash...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col">
      {/* Header */}
      <Header
        decks={decks}
        selectedDeckId={selectedDeckId}
        onSelectDeck={setSelectedDeckId}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'study') setStudyTargetCardId(undefined);
        }}
        onOpenAddModal={handleAddNewCard}
        onOpenDeckModal={() => setIsDeckModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        cards={cards}
        isServerConnected={isServerConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'library' && (
          <FlashcardGrid
            cards={cards}
            decks={decks}
            selectedDeckId={selectedDeckId}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onToggleStatus={handleToggleStatus}
            onStudyCard={handleStudyCard}
            onAddNew={handleAddNewCard}
            onQuickUploadImage={handleQuickUploadImage}
          />
        )}

        {activeTab === 'study' && (
          <StudyMode
            cards={activeCards.length > 0 ? activeCards : cards}
            onUpdateCardStatus={handleUpdateCardStatus}
            onExit={() => {
              setActiveTab('library');
              setStudyTargetCardId(undefined);
            }}
            initialCardId={studyTargetCardId}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizMode
            cards={activeCards.length > 0 ? activeCards : cards}
            onExit={() => setActiveTab('library')}
          />
        )}
      </main>

      {/* Modals */}
      <FlashcardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        initialCard={editingCard}
        decks={decks}
        defaultDeckId={selectedDeckId}
      />

      <DeckManagerModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
        decks={decks}
        cards={cards}
        onSaveDeck={handleSaveDeck}
        onDeleteDeck={handleDeleteDeck}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={handleDataRestored}
        cardsCount={cards.length}
      />
    </div>
  );
}
