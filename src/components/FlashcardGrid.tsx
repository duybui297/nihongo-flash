import React, { useState, useMemo, useRef } from 'react';
import { Flashcard, Deck, JLPTLevel, StudyStatus } from '../types/flashcard';
import { 
  Search, 
  Volume2, 
  Edit3, 
  Trash2, 
  Video, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  Flame, 
  LayoutGrid, 
  List, 
  ExternalLink,
  Plus,
  Play,
  Filter,
  Eye,
  Camera
} from 'lucide-react';
import { speakJapanese } from '../services/speech';

interface FlashcardGridProps {
  cards: Flashcard[];
  decks: Deck[];
  selectedDeckId: string;
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (cardId: string) => void;
  onToggleStatus: (card: Flashcard) => void;
  onStudyCard: (card: Flashcard) => void;
  onAddNew: () => void;
  onQuickUploadImage?: (card: Flashcard, file: File) => Promise<void>;
}

interface CardThumbnailItemProps {
  card: Flashcard;
  viewMode: 'grid' | 'compact';
  onPreview: () => void;
  onQuickUploadImage?: (card: Flashcard, file: File) => Promise<void>;
}

const CardThumbnailItem: React.FC<CardThumbnailItemProps> = ({
  card,
  viewMode,
  onPreview,
  onQuickUploadImage,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const thumb = card.thumbnailUrl || card.imageUrl;
  const hasVideo = Boolean(card.videoUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onQuickUploadImage) return;
    try {
      setIsUploading(true);
      await onQuickUploadImage(card, file);
      setHasError(false);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (viewMode === 'compact') {
    return (
      <div 
        onClick={onPreview}
        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-900 overflow-hidden shrink-0 cursor-pointer border border-stone-200 flex items-center justify-center group/compactThumb"
      >
        {thumb && !hasError ? (
          <img
            src={thumb}
            alt={card.title}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover group-hover/compactThumb:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950 flex flex-col items-center justify-center p-1 text-center">
            <span className="text-sm font-japanese font-bold text-white leading-none">
              {card.japanese}
            </span>
          </div>
        )}
        {hasVideo && (
          <span className="absolute bottom-1 right-1 p-0.5 rounded bg-black/75 text-white">
            <Video className="w-3 h-3 text-indigo-400" />
          </span>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div 
      onClick={onPreview}
      className="relative aspect-video bg-gradient-to-br from-stone-900 to-stone-950 cursor-pointer overflow-hidden flex items-center justify-center group/thumb"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={handleFileChange}
      />

      {thumb && !hasError ? (
        <img
          src={thumb}
          alt={card.title}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
        />
      ) : (
        /* Fallback Graphic when image fails or is missing */
        <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-stone-900 to-rose-950 text-white relative select-none">
          <div className="text-3xl sm:text-4xl font-japanese font-black tracking-wider text-white drop-shadow-md mb-1 text-center">
            {card.japanese}
          </div>
          {card.reading && (
            <div className="text-xs font-japanese text-rose-300 font-medium">
              【{card.reading}】
            </div>
          )}
          <div className="text-[11px] text-stone-300 mt-1 max-w-[85%] truncate text-center">
            {card.meaning || card.title}
          </div>

          {onQuickUploadImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isUploading}
              className="mt-3 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md transition-all z-10"
              title="Tải ảnh mới từ máy tính của bạn"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Đang tải...' : 'Tải ảnh của bạn lên'}</span>
            </button>
          )}
        </div>
      )}

      {/* Top Overlay Badges: JLPT + Media Badges */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
          {card.jlpt}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-semibold">
          {card.category}
        </span>
      </div>

      {/* Top Right Media Icon (Video/Image) */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10 pointer-events-none">
        {hasVideo && (
          <span 
            title="Có video minh hoạ"
            className="p-1 rounded-md bg-indigo-600/90 text-white backdrop-blur-xs shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
          </span>
        )}
        {card.imageUrl && !hasVideo && (
          <span 
            title="Có hình ảnh minh hoạ"
            className="p-1 rounded-md bg-stone-900/70 text-white backdrop-blur-xs shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Hover Overlay Play / Preview Button + Quick Change Image */}
      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/95 text-stone-900 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 shadow-md">
          <Eye className="w-3.5 h-3.5 text-rose-600" />
          Xem chi tiết
        </div>

        {onQuickUploadImage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1 shadow-md transition-colors"
            title="Tải ảnh mới từ máy tính của bạn"
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>Đổi ảnh</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  cards,
  decks,
  selectedDeckId,
  onEditCard,
  onDeleteCard,
  onToggleStatus,
  onStudyCard,
  onAddNew,
  onQuickUploadImage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJlpt, setSelectedJlpt] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'status'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  
  // Preview Modal state
  const [previewCard, setPreviewCard] = useState<Flashcard | null>(null);

  // Filter cards
  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        // Deck filter
        if (selectedDeckId !== 'all' && card.deckId !== selectedDeckId) {
          return false;
        }

        // Search query filter (matches title, japanese, reading, meaning, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = card.title?.toLowerCase().includes(q);
          const matchJapanese = card.japanese?.toLowerCase().includes(q);
          const matchReading = card.reading?.toLowerCase().includes(q);
          const matchMeaning = card.meaning?.toLowerCase().includes(q);
          const matchDesc = card.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchJapanese && !matchReading && !matchMeaning && !matchDesc) {
            return false;
          }
        }

        // JLPT filter
        if (selectedJlpt !== 'all' && card.jlpt !== selectedJlpt) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && card.status !== selectedStatus) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && card.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title, 'vi');
        }
        if (sortBy === 'status') {
          const order = { new: 0, learning: 1, mastered: 2 };
          return order[b.status] - order[a.status];
        }
        return 0;
      });
  }, [cards, selectedDeckId, searchQuery, selectedJlpt, selectedStatus, selectedCategory, sortBy]);

  const jlptLevels: Array<JLPTLevel | 'all'> = ['all', 'N5', 'N4', 'N3', 'N2', 'N1'];

  const getDeckName = (deckId: string) => {
    return decks.find((d) => d.id === deckId)?.name || 'Mặc định';
  };

  const getStatusBadge = (status: StudyStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Đã thuộc
          </span>
        );
      case 'learning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md">
            <Flame className="w-3 h-3 text-amber-600" />
            Đang học
          </span>
        );
      case 'new':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-sky-600" />
            Chưa học
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        {/* Top Row: Search input + View Switcher */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, chữ Hán, cách đọc, ý nghĩa, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 hover:bg-stone-100/70 focus:bg-white text-sm text-stone-900 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 hover:bg-stone-300 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode & Sort Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-stone-50 border border-stone-200 text-stone-700 rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="title">Theo Tiêu đề (A-Z)</option>
              <option value="status">Theo Độ thuộc</option>
            </select>

            <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Dạng lưới thumbnail lớn"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'compact' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Dạng danh sách chi tiết"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills: JLPT + Status */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            JLPT:
          </span>
          {jlptLevels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedJlpt(lvl)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedJlpt === lvl
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {lvl === 'all' ? 'Tất cả' : lvl}
            </button>
          ))}

          <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

          <span className="text-xs font-semibold text-stone-500 mr-1">Trạng thái:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'mastered', label: 'Đã thuộc' },
            { id: 'learning', label: 'Đang học' },
            { id: 'new', label: 'Chưa học' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedStatus === st.id
                  ? 'bg-stone-800 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Display Section */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">
            Không tìm thấy flashcard nào
          </h3>
          <p className="text-xs text-stone-500 mb-5 leading-relaxed">
            {searchQuery || selectedJlpt !== 'all' || selectedStatus !== 'all'
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc JLPT/Trạng thái.'
              : 'Bộ thẻ này hiện chưa có từ vựng nào. Hãy thêm thẻ mới kèm ảnh, video và mô tả để bắt đầu!'}
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo thẻ flashcard mới
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: Prominently displays Thumbnail & Title (as requested) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => {
            const thumb = card.thumbnailUrl || card.imageUrl;
            const hasVideo = Boolean(card.videoUrl);

            return (
              <div
                key={card.id}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* 1. THUMBNAIL CONTAINER (Prominent visual display with error fallback & quick upload) */}
                <CardThumbnailItem
                  card={card}
                  viewMode="grid"
                  onPreview={() => setPreviewCard(card)}
                  onQuickUploadImage={onQuickUploadImage}
                />

                {/* 2. CARD CONTENT: TITLE & DETAILS */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Status & Audio Pronunciation Row */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <button
                        onClick={() => onToggleStatus(card)}
                        title="Nhấn để đổi trạng thái học tập"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {getStatusBadge(card.status)}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(card.japanese || card.reading);
                        }}
                        className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
                        title="Nghe phát âm chuẩn tiếng Nhật"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Phát âm</span>
                      </button>
                    </div>

                    {/* PROMINENT TITLE (User Requirement: "chữ title và thumbnail") */}
                    <h3 
                      onClick={() => setPreviewCard(card)}
                      className="text-sm font-bold text-stone-900 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {card.title}
                    </h3>

                    {/* Japanese Word & Reading Subline */}
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-bold font-japanese text-stone-900 tracking-wide">
                        {card.japanese}
                      </span>
                      {card.reading && (
                        <span className="text-xs text-stone-500 font-japanese">
                          【{card.reading}】
                        </span>
                      )}
                    </div>

                    {/* Meaning */}
                    {card.meaning && (
                      <p className="text-xs font-medium text-stone-700 line-clamp-1 mt-0.5">
                        {card.meaning}
                      </p>
                    )}

                    {/* Description Snippet */}
                    {card.description && (
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1.5 leading-relaxed bg-stone-50 p-2 rounded-lg border border-stone-100">
                        {card.description}
                      </p>
                    )}
                  </div>

                  {/* 3. CARD ACTION BAR */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="text-[11px] text-stone-400 truncate max-w-[120px]">
                      {getDeckName(card.deckId)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onStudyCard(card)}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-[11px] font-medium flex items-center gap-1 shadow-2xs"
                        title="Học riêng thẻ này"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Ôn tập
                      </button>

                      <button
                        onClick={() => onEditCard(card)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                        title="Chỉnh sửa thẻ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteCard(card.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Xoá thẻ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT / ROW VIEW: Highlight Title + Thumbnail side by side */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100 shadow-2xs">
          {filteredCards.map((card) => {
            const thumb = card.thumbnailUrl || card.imageUrl;
            const hasVideo = Boolean(card.videoUrl);

            return (
              <div
                key={card.id}
                className="p-3.5 sm:p-4 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Thumbnail & Title & Kanji */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Prominent Thumbnail */}
                  <CardThumbnailItem
                    card={card}
                    viewMode="compact"
                    onPreview={() => setPreviewCard(card)}
                    onQuickUploadImage={onQuickUploadImage}
                  />

                  {/* Title and details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-stone-900 text-white">
                        {card.jlpt}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                        {card.category}
                      </span>
                      <button
                        onClick={() => onToggleStatus(card)}
                        className="cursor-pointer"
                      >
                        {getStatusBadge(card.status)}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setPreviewCard(card)}
                      className="text-sm font-bold text-stone-900 hover:text-rose-600 transition-colors cursor-pointer truncate"
                    >
                      {card.title}
                    </h3>

                    {/* Japanese text & Meaning */}
                    <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                      <span className="text-sm font-bold font-japanese text-stone-900">
                        {card.japanese}
                      </span>
                      {card.reading && (
                        <span className="text-xs text-stone-500 font-japanese">
                          【{card.reading}】
                        </span>
                      )}
                      {card.meaning && (
                        <span className="text-xs text-stone-600">
                          - {card.meaning}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Audio & Action buttons */}
                <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => speakJapanese(card.japanese || card.reading)}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Nghe phát âm chuẩn tiếng Nhật"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onStudyCard(card)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Ôn tập
                  </button>

                  <button
                    onClick={() => onEditCard(card)}
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Sửa thẻ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCard(card.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa thẻ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-bold">
                  {previewCard.jlpt}
                </span>
                <span className="text-xs text-stone-500">
                  {getDeckName(previewCard.deckId)} • {previewCard.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewCard(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Media viewer */}
              {previewCard.videoUrl ? (
                <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video
                    src={previewCard.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : previewCard.imageUrl ? (
                <div className="rounded-xl overflow-hidden bg-stone-900 aspect-video flex items-center justify-center">
                  <img
                    src={previewCard.imageUrl}
                    alt={previewCard.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}

              {/* Title & Japanese Head */}
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  {previewCard.title}
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-2xl font-bold font-japanese text-stone-900">
                    {previewCard.japanese}
                  </span>
                  {previewCard.reading && (
                    <span className="text-sm font-medium text-stone-600 font-japanese">
                      【{previewCard.reading}】
                    </span>
                  )}
                  <button
                    onClick={() => speakJapanese(previewCard.japanese || previewCard.reading)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe phát âm
                  </button>
                </div>
                {previewCard.meaning && (
                  <p className="text-sm font-semibold text-rose-700 mt-1">
                    Ý nghĩa: {previewCard.meaning}
                  </p>
                )}
              </div>

              {/* Description box */}
              {previewCard.description && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Mô tả chi tiết & Ghi chú
                  </h4>
                  <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                    {previewCard.description}
                  </p>
                </div>
              )}

              {/* Examples */}
              {previewCard.examples && previewCard.examples.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Câu ví dụ mẫu
                  </h4>
                  {previewCard.examples.map((ex) => (
                    <div key={ex.id} className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 font-japanese">
                          {ex.japanese}
                        </span>
                        <button
                          onClick={() => speakJapanese(ex.japanese)}
                          className="text-stone-500 hover:text-rose-600"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {ex.reading && <p className="text-stone-500 font-japanese">{ex.reading}</p>}
                      <p className="text-stone-700">{ex.vietnamese}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <button
                onClick={() => {
                  const card = previewCard;
                  setPreviewCard(null);
                  onEditCard(card);
                }}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg"
              >
                Chỉnh sửa thẻ này
              </button>
              <button
                onClick={() => {
                  const card = previewCard;
                  setPreviewCard(null);
                  onStudyCard(card);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Vào chế độ ôn tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
