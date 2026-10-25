import React, { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '../types/flashcard';
import {
  HelpCircle,
  Volume2,
  CheckCircle,
  XCircle,
  RotateCw,
  ArrowRight,
  Trophy,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakJapanese } from '../services/speech';
import { shuffleArray } from '../utils/shuffle';
import { resolveMediaUrl } from '../utils/media';

interface QuizModeProps {
  cards: Flashcard[];
  onExit: () => void;
}

interface Question {
  card: Flashcard;
  type: 'kanji_to_meaning' | 'meaning_to_kanji' | 'listening';
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctAnswer: string;
}

export const QuizMode: React.FC<QuizModeProps> = ({ cards, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Generate quiz questions (Fixes B8: Fisher-Yates shuffle + deduplication of options)
  const generateQuestions = useCallback(() => {
    if (cards.length < 2) return;

    const generated: Question[] = [];
    const pool = shuffleArray(cards);
    const questionCount = Math.min(pool.length, 10);

    for (let i = 0; i < questionCount; i++) {
      const target = pool[i];
      const types: ('kanji_to_meaning' | 'meaning_to_kanji' | 'listening')[] = [
        'kanji_to_meaning',
        'meaning_to_kanji',
        'listening',
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];

      let prompt = '';
      let subPrompt: string | undefined = undefined;
      let correctAnswer = '';
      let wrongPool: string[] = [];

      if (selectedType === 'kanji_to_meaning') {
        prompt = target.japanese;
        subPrompt = target.reading ? `【${target.reading}】` : undefined;
        correctAnswer = target.meaning;
        wrongPool = cards
          .filter((c) => c.id !== target.id && c.meaning && c.meaning !== target.meaning)
          .map((c) => c.meaning);
      } else if (selectedType === 'meaning_to_kanji') {
        prompt = target.meaning;
        subPrompt = 'Từ tiếng Nhật tương ứng là gì?';
        correctAnswer = target.japanese;
        wrongPool = cards
          .filter((c) => c.id !== target.id && c.japanese && c.japanese !== target.japanese)
          .map((c) => c.japanese);
      } else {
        // Listening
        prompt = '🔊 Nghe phát âm';
        subPrompt = 'Chọn từ vựng tiếng Nhật bạn vừa nghe được:';
        correctAnswer = `${target.japanese} (${target.meaning})`;
        wrongPool = cards
          .filter((c) => c.id !== target.id)
          .map((c) => `${c.japanese} (${c.meaning})`)
          .filter((opt) => opt !== correctAnswer);
      }

      // Deduplicate wrong options and shuffle
      const uniqueWrongs = Array.from(new Set(wrongPool));
      const shuffledWrongs = shuffleArray(uniqueWrongs).slice(0, 3);
      const options = shuffleArray([correctAnswer, ...shuffledWrongs]);

      generated.push({
        card: target,
        type: selectedType,
        prompt,
        subPrompt,
        options,
        correctAnswer,
      });
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  }, [cards]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ?.type === 'listening' && currentQ.card) {
      speakJapanese(currentQ.card.japanese || currentQ.card.reading);
    }
  }, [currentQ]);

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null || !currentQ) return;
    setSelectedAnswer(option);

    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 10 + streak * 2);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  if (cards.length < 2) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto shadow-sm">
        <HelpCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-900 mb-1">Cần ít nhất 2 thẻ để chơi Trắc nghiệm</h3>
        <p className="text-xs text-stone-500 mb-4">Vui lòng tạo thêm thẻ để hệ thống có thể tạo các câu hỏi trắc nghiệm.</p>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
        >
          Quay lại danh sách thẻ
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-stone-900">
            Kết thúc phần thi Trắc nghiệm!
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Bạn đã hoàn thành {questions.length} câu hỏi thử thách phản xạ tiếng Nhật.
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-center">
          <span className="text-4xl font-extrabold text-amber-800 block">
            {score} điểm
          </span>
          <span className="text-xs text-amber-900 font-semibold mt-1 block">
            Điểm số xuất sắc!
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={generateQuestions}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Luyện tập ván mới
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

  if (!currentQ) return null;

  const isAnswered = selectedAnswer !== null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Quiz Top bar: Progress, score, streak */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700">
            Câu {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Flame className="w-4 h-4 fill-current" />
              <span>Chuỗi x{streak}</span>
            </div>
          )}

          <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
            {score} Điểm
          </div>

          <button
            onClick={onExit}
            className="text-xs text-stone-400 hover:text-stone-700 p-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-8 text-center space-y-6">
        {/* Question Type Banner */}
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          {currentQ.type === 'kanji_to_meaning' && 'Chữ Hán sang Nghĩa'}
          {currentQ.type === 'meaning_to_kanji' && 'Nghĩa sang Từ vựng'}
          {currentQ.type === 'listening' && 'Luyện nghe phản xạ'}
        </div>

        {/* Prompt */}
        <div className="py-2">
          {currentQ.type === 'listening' ? (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => speakJapanese(currentQ.card.japanese || currentQ.card.reading)}
                className="w-16 h-16 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-600/30 transition-transform active:scale-95"
              >
                <Volume2 className="w-8 h-8" />
              </button>
              <span className="text-xs font-bold text-stone-500">
                Nhấn vào loa để nghe lại
              </span>
            </div>
          ) : (
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold font-japanese text-stone-900 tracking-tight">
                {currentQ.prompt}
              </h2>
              {currentQ.subPrompt && (
                <p className="text-sm font-medium text-stone-500 mt-2 font-japanese">
                  {currentQ.subPrompt}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail Preview Hint (if available) */}
        {currentQ.card.thumbnailUrl && (
          <div className="w-24 h-16 rounded-xl overflow-hidden bg-stone-900 mx-auto border border-stone-200 opacity-90">
            <img
              src={resolveMediaUrl(currentQ.card.thumbnailUrl)}
              alt="Hint"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* OPTIONS (4 Choices) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = opt === currentQ.correctAnswer;
            const isSelected = opt === selectedAnswer;

            let btnStyle = 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
              } else {
                btnStyle = 'bg-stone-50 text-stone-400 border-stone-200 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(opt)}
                className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all text-left flex items-center justify-between shadow-2xs ${btnStyle}`}
              >
                <span className="line-clamp-2">{opt}</span>
                {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Next Question CTA */}
        {isAnswered && (
          <div className="pt-3 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
