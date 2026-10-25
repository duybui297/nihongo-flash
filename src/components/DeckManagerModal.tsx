import React, { useState } from 'react';
import type { Deck, Flashcard } from '../types/flashcard';
import { DECK_COLOR_PRESETS, DECK_ICON_PRESETS, DEFAULT_DECK_COLOR, DEFAULT_DECK_ICON } from '../types/flashcard';
import { X, Plus, Trash2, Edit2, Layers } from 'lucide-react';

interface DeckManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  cards: Flashcard[];
  onSaveDeck: (deck: Deck) => Promise<Deck | void>;
  onDeleteDeck: (deckId: string) => Promise<void>;
}

export const DeckManagerModal: React.FC<DeckManagerModalProps> = ({
  isOpen,
  onClose,
  decks,
  cards,
  onSaveDeck,
  onDeleteDeck,
}) => {
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(DEFAULT_DECK_COLOR);
  const [icon, setIcon] = useState(DEFAULT_DECK_ICON);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    // Empty id signals a new deck (Fixes B1)
    setEditingDeck({
      id: '',
      name: '',
      description: '',
      color: DEFAULT_DECK_COLOR,
      icon: DEFAULT_DECK_ICON,
      createdAt: '',
    });
    setName('');
    setDescription('');
    setColor(DEFAULT_DECK_COLOR);
    setIcon(DEFAULT_DECK_ICON);
  };

  const handleStartEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setName(deck.name);
    setDescription(deck.description);
    setColor(deck.color || DEFAULT_DECK_COLOR);
    setIcon(deck.icon || DEFAULT_DECK_ICON);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const deckToSave: Deck = {
      id: editingDeck?.id || '',
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      createdAt: editingDeck?.createdAt || new Date().toISOString(),
    };

    try {
      setIsSaving(true);
      await onSaveDeck(deckToSave);
      setEditingDeck(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-stone-900">
              Quản lý Bộ thẻ (Decks)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!editingDeck ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Danh sách bộ thẻ ({decks.length})
                </span>
                <button
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tạo bộ thẻ mới
                </button>
              </div>

              <div className="space-y-2">
                {decks.map((deck) => {
                  const count = cards.filter((c) => c.deckId === deck.id).length;
                  return (
                    <div
                      key={deck.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{deck.icon || '📁'}</span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {deck.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">
                            {deck.description || 'Chưa có mô tả'} • {count} thẻ
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(deck)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md"
                          title="Sửa bộ thẻ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {decks.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xoá bộ thẻ "${deck.name}"? Các thẻ trong bộ sẽ được chuyển sang bộ thẻ khác.`)) {
                                onDeleteDeck(deck.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-md"
                            title="Xoá bộ thẻ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                {editingDeck.id ? 'Chỉnh sửa bộ thẻ' : 'Tạo bộ thẻ mới'}
              </h4>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên bộ thẻ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Kanji N3 Somatome, Minna no Nihongo..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  placeholder="VD: Các chữ Hán trọng tâm thi JLPT N3..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Biểu tượng Icon
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DECK_ICON_PRESETS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition-all ${
                        icon === ic ? 'border-rose-500 bg-rose-50 scale-110' : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Màu chủ đề
                </label>
                <div className="flex flex-wrap gap-2">
                  {DECK_COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        color === c ? 'border-stone-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDeck(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                  disabled={isSaving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu bộ thẻ'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
