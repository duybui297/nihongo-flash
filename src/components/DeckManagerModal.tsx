import React, { useState } from 'react';
import { Deck, Flashcard } from '../types/flashcard';
import { X, Plus, Trash2, FolderPlus, Edit2, Layers } from 'lucide-react';

interface DeckManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  cards: Flashcard[];
  onSaveDeck: (deck: Deck) => Promise<void>;
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
  const [color, setColor] = useState('#ef4444');
  const [icon, setIcon] = useState('🌸');

  if (!isOpen) return null;

  const colorPresets = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#0284c7', // Sky
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
  ];

  const iconPresets = ['🌸', '🗻', '🍵', '🍱', '⛩️', '🏮', '🏯', '🎌', '🐱', '📖', '🎯', '✨'];

  const handleStartCreate = () => {
    setEditingDeck({
      id: `deck-${Date.now()}`,
      name: '',
      description: '',
      color: '#ef4444',
      icon: '🌸',
      createdAt: new Date().toISOString(),
    });
    setName('');
    setDescription('');
    setColor('#ef4444');
    setIcon('🌸');
  };

  const handleStartEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setName(deck.name);
    setDescription(deck.description);
    setColor(deck.color || '#ef4444');
    setIcon(deck.icon || '🌸');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const deckToSave: Deck = {
      id: editingDeck?.id || `deck-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      createdAt: editingDeck?.createdAt || new Date().toISOString(),
    };

    await onSaveDeck(deckToSave);
    setEditingDeck(null);
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
                              if (confirm(`Bạn có chắc muốn xoá bộ thẻ "${deck.name}"?`)) {
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
                {editingDeck.name ? 'Chỉnh sửa bộ thẻ' : 'Tạo bộ thẻ mới'}
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
                  className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2.5 font-medium"
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
                  className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2.5"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Biểu tượng Icon
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {iconPresets.map((ic) => (
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
                  {colorPresets.map((c) => (
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
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Lưu bộ thẻ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
