import React, { useState } from 'react';
import type { Flashcard } from './types/flashcard';
import { useFlashcards } from './hooks/useFlashcards';
import { Header } from './components/Header';
import { FlashcardGrid } from './components/FlashcardGrid';
import { FlashcardModal } from './components/FlashcardModal';
import { StudyMode } from './components/StudyMode';
import { QuizMode } from './components/QuizMode';
import { DeckManagerModal } from './components/DeckManagerModal';
import { BackupModal } from './components/BackupModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const {
    cards,
    decks,
    selectedDeckId,
    setSelectedDeckId,
    activeTab,
    setActiveTab,
    isServerConnected,
    isLoading,
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
  } = useFlashcards();

  // Modals state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
        <p className="text-sm font-medium text-stone-600">Đang khởi tạo NihonFlash...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans">
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
            onStudyCard={startStudy}
            onAddNew={handleAddNewCard}
            onQuickUploadImage={handleQuickUploadImage}
          />
        )}

        {activeTab === 'study' && (
          <StudyMode
            cards={activeDeckCards.length > 0 ? activeDeckCards : cards}
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
            cards={activeDeckCards.length > 0 ? activeDeckCards : cards}
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
