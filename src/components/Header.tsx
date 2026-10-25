import React from 'react';
import { Deck, Flashcard } from '../types/flashcard';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Plus, 
  FolderPlus, 
  Download, 
  Database,
  CheckCircle2, 
  Flame, 
  Clock 
} from 'lucide-react';

interface HeaderProps {
  decks: Deck[];
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  activeTab: 'library' | 'study' | 'quiz';
  onChangeTab: (tab: 'library' | 'study' | 'quiz') => void;
  onOpenAddModal: () => void;
  onOpenDeckModal: () => void;
  onOpenBackupModal: () => void;
  cards: Flashcard[];
  isServerConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  decks,
  selectedDeckId,
  onSelectDeck,
  activeTab,
  onChangeTab,
  onOpenAddModal,
  onOpenDeckModal,
  onOpenBackupModal,
  cards,
  isServerConnected = true,
}) => {
  const currentDeck = decks.find((d) => d.id === selectedDeckId);
  const deckCards = selectedDeckId === 'all' 
    ? cards 
    : cards.filter((c) => c.deckId === selectedDeckId);

  const masteredCount = deckCards.filter((c) => c.status === 'mastered').length;
  const learningCount = deckCards.filter((c) => c.status === 'learning').length;
  const newCount = deckCards.filter((c) => c.status === 'new').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner / Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <span className="font-bold text-lg font-mono">日</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                  NihonFlash
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                    日本語
                  </span>
                </h1>
                {/* Server Persistence Badge (Clickable to open Quản Lý & Sao Lưu Dữ Liệu) */}
                <button 
                  onClick={onOpenBackupModal}
                  title="Nhấn để mở Quản Lý & Sao Lưu Dữ Liệu Máy Chủ"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all hover:scale-105 cursor-pointer ${
                    isServerConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isServerConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <span>{isServerConnected ? 'Máy chủ Server (Active)' : 'Cục bộ Local'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-500">
                Flashcard học tiếng Nhật đa phương tiện • Lưu trữ vĩnh viễn trên máy chủ
              </p>
            </div>
          </div>

          {/* Quick Deck Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Deck Dropdown */}
            <div className="relative">
              <select
                value={selectedDeckId}
                onChange={(e) => onSelectDeck(e.target.value)}
                className="appearance-none bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-sm font-medium py-2 pl-3.5 pr-8 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer transition-colors"
              >
                <option value="all">📚 Tất cả bộ thẻ ({cards.length} thẻ)</option>
                {decks.map((deck) => {
                  const count = cards.filter((c) => c.deckId === deck.id).length;
                  return (
                    <option key={deck.id} value={deck.id}>
                      {deck.icon || '📁'} {deck.name} ({count})
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-500">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Deck Management Button */}
            <button
              onClick={onOpenDeckModal}
              title="Quản lý bộ thẻ"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {/* Quản Lý & Sao Lưu Dữ Liệu Button */}
            <button
              onClick={onOpenBackupModal}
              title="Quản Lý & Sao Lưu Dữ Liệu Máy Chủ"
              className="p-2 text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold hidden lg:inline">Quản Lý & Sao Lưu</span>
            </button>

            {/* Add Flashcard CTA */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-sm shadow-rose-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ mới</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Mini Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-stone-100 pt-2 pb-1 gap-2">
          {/* Main Tabs */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onChangeTab('library')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'library'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Danh sách thẻ</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'library' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700'
              }`}>
                {deckCards.length}
              </span>
            </button>

            <button
              onClick={() => onChangeTab('study')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'study'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lật thẻ ôn tập</span>
            </button>

            <button
              onClick={() => onChangeTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Trắc nghiệm</span>
            </button>
          </nav>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-3 text-xs text-stone-600 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã thuộc: <strong className="text-emerald-700">{masteredCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-md">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Đang học: <strong className="text-amber-700">{learningCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Mới: <strong className="text-sky-700">{newCount}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
