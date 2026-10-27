import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Flashcard, StudyStatus } from '../types/flashcard';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  X,
  Shuffle,
  Sparkles,
  Video,
  BookOpen,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakJapanese } from '../services/speech';
import { shuffleArray } from '../utils/shuffle';
import { resolveMediaUrl } from '../utils/media';
import { GrammarAnalysisDrawer } from './GrammarAnalysisDrawer';

interface StudyModeProps {
  cards: Flashcard[];
  onUpdateCardStatus: (cardId: string, newStatus: StudyStatus) => Promise<void>;
  onExit: () => void;
  initialCardId?: string;
}

export const StudyMode: React.FC<StudyModeProps> = ({
  cards,
  onUpdateCardStatus,
  onExit,
  initialCardId,
}) => {
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<{
    mastered: number;
    learning: number;
    again: number;
  }>({
    mastered: 0,
    learning: 0,
    again: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedExampleForGrammar, setSelectedExampleForGrammar] = useState<{
    sentence: string;
    reading?: string;
    vietnamese?: string;
  } | null>(null);
  const [isGrammarDrawerOpen, setIsGrammarDrawerOpen] = useState(false);

  const handleOpenGrammar = (ex: { japanese: string; reading?: string; vietnamese: string }) => {
    setSelectedExampleForGrammar({
      sentence: ex.japanese,
      reading: ex.reading,
      vietnamese: ex.vietnamese,
    });
    setIsGrammarDrawerOpen(true);
  };

  const currentCard = studyCards[currentIndex];

  useEffect(() => {
    if (!currentCard?.imageUrl) {
      setIsImageLoading(false);
      return;
    }
    setIsImageLoading(true);
    const timer = setTimeout(() => setIsImageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [currentIndex, isFlipped, currentCard?.imageUrl]);

  // Track initial setup so parent card updates don't reset the index (Fixes B3)
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (cards.length === 0) return;
    if (isInitializedRef.current) return;

    isInitializedRef.current = true;

    if (initialCardId) {
      const idx = cards.findIndex((c) => c.id === initialCardId);
      if (idx !== -1) {
        const reordered = [cards[idx], ...cards.filter((_, i) => i !== idx)];
        setStudyCards(reordered);
        setCurrentIndex(0);
        return;
      }
    }
    setStudyCards([...cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, [cards, initialCardId]);


  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
      triggerConfetti();
    }
  }, [currentIndex, studyCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleShuffle = () => {
    setStudyCards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRate = async (rating: 'again' | 'learning' | 'mastered') => {
    if (!currentCard) return;

    let newStatus: StudyStatus = currentCard.status;
    if (rating === 'mastered') {
      newStatus = 'mastered';
      setSessionResults((prev) => ({ ...prev, mastered: prev.mastered + 1 }));
    } else if (rating === 'learning') {
      newStatus = 'learning';
      setSessionResults((prev) => ({ ...prev, learning: prev.learning + 1 }));
    } else {
      newStatus = 'learning';
      setSessionResults((prev) => ({ ...prev, again: prev.again + 1 }));
    }

    // Update local card state in place so we don't desync
    setStudyCards((prev) =>
      prev.map((c, i) => (i === currentIndex ? { ...c, status: newStatus } : c))
    );

    await onUpdateCardStatus(currentCard.id, newStatus);
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1' && isFlipped) {
        handleRate('again');
      } else if (e.key === '2' && isFlipped) {
        handleRate('learning');
      } else if (e.key === '3' && isFlipped) {
        handleRate('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isFlipped]);

  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto shadow-sm">
        <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-900 mb-1">Không có thẻ để ôn tập</h3>
        <p className="text-xs text-stone-500 mb-4">Vui lòng thêm thẻ vào bộ trước khi bắt đầu học.</p>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Completed Screen
  if (isCompleted) {
    const total = studyCards.length;
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-stone-900">
            お疲れ様でした! (Hoàn thành xuất sắc!)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Bạn đã ôn tập xong toàn bộ {total} flashcard trong phiên học này.
          </p>
        </div>

        {/* Results summary */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-center">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-2xl font-extrabold text-emerald-700 block">
              {sessionResults.mastered}
            </span>
            <span className="text-[11px] font-semibold text-emerald-800">Đã thuộc</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-2xl font-extrabold text-amber-700 block">
              {sessionResults.learning}
            </span>
            <span className="text-[11px] font-semibold text-amber-800">Tạm nhớ</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <span className="text-2xl font-extrabold text-rose-700 block">
              {sessionResults.again}
            </span>
            <span className="text-[11px] font-semibold text-rose-800">Cần ôn lại</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setIsCompleted(false);
              setSessionResults({ mastered: 0, learning: 0, again: 0 });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Ôn tập lại từ đầu
          </button>

          <button
            onClick={onExit}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl"
          >
            Quay lại danh sách thẻ
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  const thumb = resolveMediaUrl(currentCard.thumbnailUrl || currentCard.imageUrl);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header: Progress & controls */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-700">
            Thẻ {currentIndex + 1} / {studyCards.length}
          </span>
          <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / studyCards.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShuffle}
            title="Trộn ngẫu nhiên thứ tự thẻ"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs flex items-center gap-1 font-medium"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trộn thẻ</span>
          </button>

          <button
            onClick={onExit}
            title="Đóng chế độ ôn tập"
            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FLASHCARD (Interactive 3D Flip Card Container) */}
      <div
        onClick={handleFlip}
        className="relative min-h-[440px] bg-white rounded-3xl border-2 border-stone-200 shadow-xl cursor-pointer transition-all duration-300 hover:border-rose-300 flex flex-col justify-between overflow-hidden"
      >
        {/* CARD TOP BAR */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-white text-xs font-bold shadow-2xs">
              {currentCard.jlpt}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold">
              {currentCard.category}
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => speakJapanese(currentCard.japanese || currentCard.reading, currentCard.audioUrl)}
              className={`px-3 py-1 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all ${
                currentCard.audioUrl
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
              }`}
              title={currentCard.audioUrl ? 'Nghe phát âm chuẩn AI Studio' : 'Phát âm chuẩn tiếng Nhật'}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{currentCard.audioUrl ? 'AI Phát âm' : 'Phát âm'}</span>
            </button>

            <span className="text-[11px] text-stone-400 hidden sm:inline ml-2">
              (Phím Space: Lật thẻ)
            </span>
          </div>
        </div>

        {/* CARD BODY: FRONT vs BACK */}
        {!isFlipped ? (
          /* ================= FRONT SIDE ================= */
          <div className="p-6 sm:p-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
            {/* Title banner */}
            <span className="text-xs font-semibold text-stone-400 tracking-wider uppercase">
              {currentCard.title}
            </span>

            {/* Main Japanese Kanji / Word */}
            <div className="py-2">
              <h2 className="text-5xl sm:text-7xl font-bold font-japanese text-stone-900 tracking-tight">
                {currentCard.japanese}
              </h2>
            </div>

            {/* Thumbnail Preview Hint (if available) */}
            {thumb && (
              <div className="w-32 h-20 sm:w-40 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-stone-900 to-rose-950 border border-stone-200 shadow-sm relative group/img flex items-center justify-center">
                <img
                  src={thumb}
                  alt={currentCard.title}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
                {currentCard.videoUrl && (
                  <span className="absolute bottom-1 right-1 p-1 rounded-md bg-black/80 text-white">
                    <Video className="w-3 h-3 text-indigo-400" />
                  </span>
                )}
              </div>
            )}

            <div className="pt-4 flex items-center gap-1.5 text-xs text-rose-600 font-semibold animate-pulse">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Nhấn thẻ hoặc nhấn phím Space để xem đáp án & mô tả</span>
            </div>
          </div>
        ) : (
          /* ================= BACK SIDE (Detailed View with Media & Description) ================= */
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 overflow-y-auto max-h-[600px]"
          >
            {/* Pronunciation & Meaning */}
            <div className="text-center space-y-2 border-b border-stone-100 pb-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold font-japanese text-stone-900">
                  {currentCard.japanese}
                </span>
                {currentCard.reading && (
                  <span className="text-lg font-medium font-japanese text-rose-600">
                    【{currentCard.reading}】
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-stone-800">
                {currentCard.meaning}
              </h3>
            </div>

            {/* Media Showcase: Video or Image */}
            {currentCard.videoUrl ? (
              <div className="rounded-2xl overflow-hidden bg-black aspect-video max-h-64 mx-auto w-full shadow-md">
                <video
                  src={resolveMediaUrl(currentCard.videoUrl)}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : currentCard.imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-stone-900 to-rose-950 aspect-video max-h-64 mx-auto w-full shadow-md flex items-center justify-center p-2">
                {isImageLoading && (
                  <div className="absolute inset-0 bg-stone-900 flex flex-col items-center justify-center gap-2 select-none z-10 animate-pulse pointer-events-none">
                    <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                    <span className="text-xs font-medium text-stone-300">Đang tải ảnh...</span>
                  </div>
                )}
                <img
                  ref={(el) => {
                    if (el?.complete && el.naturalWidth > 0) {
                      setIsImageLoading(false);
                    }
                  }}
                  src={resolveMediaUrl(currentCard.imageUrl)}
                  alt={currentCard.title}
                  onLoad={() => setIsImageLoading(false)}
                  onError={(e) => {
                    setIsImageLoading(false);
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : null}

            {/* Khung mô tả chi tiết (Description box) */}
            {currentCard.description && (
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Khung mô tả & Mẹo ghi nhớ
                </h4>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                  {currentCard.description}
                </p>
              </div>
            )}

            {/* Example Sentences */}
            {currentCard.examples && currentCard.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Mẫu câu ví dụ
                </h4>
                <div className="space-y-2">
                  {currentCard.examples.map((ex) => (
                    <div key={ex.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-stone-900 font-japanese">
                          {ex.japanese}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenGrammar(ex);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border border-indigo-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group/aiBtn"
                            title="Bật trợ lý phân tích ngữ pháp AI cho câu ví dụ này"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover/aiBtn:rotate-12 transition-transform" />
                            <span>Ngữ pháp AI</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(ex.japanese, ex.audioUrl);
                            }}
                            className="text-stone-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-100/50 cursor-pointer transition-colors"
                            title="Phát âm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {ex.reading && <p className="text-stone-500 font-japanese">{ex.reading}</p>}
                      <p className="text-stone-700">{ex.vietnamese}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARD FOOTER: RATING BUTTONS (When flipped) OR FLIP CTA */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentIndex === 0}
            className="p-2 text-stone-400 hover:text-stone-800 disabled:opacity-30 rounded-lg transition-colors"
            title="Thẻ trước (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {!isFlipped ? (
            <button
              onClick={handleFlip}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Lật xem chi tiết
            </button>
          ) : (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleRate('again')}
                className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1"
                title="Phím [1]"
              >
                <span>❌ Chưa nhớ</span>
                <span className="text-[10px] opacity-60 hidden sm:inline">(1)</span>
              </button>

              <button
                onClick={() => handleRate('learning')}
                className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1"
                title="Phím [2]"
              >
                <span>⚡ Tạm nhớ</span>
                <span className="text-[10px] opacity-60 hidden sm:inline">(2)</span>
              </button>

              <button
                onClick={() => handleRate('mastered')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
                title="Phím [3]"
              >
                <span>✅ Đã thuộc</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">(3)</span>
              </button>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-lg transition-colors"
            title="Thẻ tiếp theo (→)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide-over AI Grammar Analysis Drawer */}
      <GrammarAnalysisDrawer
        isOpen={isGrammarDrawerOpen}
        onClose={() => setIsGrammarDrawerOpen(false)}
        sentence={selectedExampleForGrammar?.sentence || ''}
        reading={selectedExampleForGrammar?.reading}
        vietnamese={selectedExampleForGrammar?.vietnamese}
        cardTitle={currentCard?.title}
      />
    </div>
  );
};
