import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  RefreshCw,
  BookOpen,
  Layers,
  Lightbulb,
  Check,
  Copy,
  Settings,
  Key,
  ExternalLink,
  ChevronRight,
  Info,
  Loader2,
} from 'lucide-react';
import type { GrammarAnalysis, WordBreakdown } from '../services/grammar';
import { analyzeGrammarWithAI } from '../services/grammar';
import { getGeminiApiKey, setGeminiApiKey } from '../services/ai';
import { speakJapanese } from '../services/speech';

interface GrammarAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sentence: string;
  reading?: string;
  vietnamese?: string;
  cardTitle?: string;
}

export const GrammarAnalysisDrawer: React.FC<GrammarAnalysisDrawerProps> = ({
  isOpen,
  onClose,
  sentence,
  reading,
  vietnamese,
  cardTitle,
}) => {
  const [analysis, setAnalysis] = useState<GrammarAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(Boolean(getGeminiApiKey()));

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load analysis whenever the sentence changes or drawer opens
  useEffect(() => {
    if (!isOpen || !sentence) return;

    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const result = await analyzeGrammarWithAI(sentence, reading, vietnamese, false);
        if (isMounted) {
          setAnalysis(result);
        }
      } catch (err) {
        console.error('Failed to load grammar analysis:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [isOpen, sentence, reading, vietnamese]);

  // Handle re-analyze with Gemini API
  const handleReanalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeGrammarWithAI(sentence, reading, vietnamese, true);
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to re-analyze with AI:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy analysis to clipboard
  const handleCopyAnalysis = () => {
    if (!analysis) return;
    const lines = [
      `【PHÂN TÍCH NGỮ PHÁP TIẾNG NHẬT N5】`,
      `Câu: ${analysis.sentence}`,
      analysis.reading ? `Cách đọc: ${analysis.reading}` : '',
      `Nghĩa: ${analysis.vietnamese}`,
      ``,
      `Cấu trúc: ${analysis.structureFormula}`,
      `Tổng quát: ${analysis.overview}`,
      ``,
      `Chi tiết thành phần từ vựng:`,
      ...analysis.words.map(
        (w) =>
          `• ${w.word} (${w.furigana || ''}) [${w.partOfSpeech}]: ${w.meaning} - ${w.role}${
            w.conjugation ? ` (${w.conjugation})` : ''
          }`
      ),
      ``,
      `Điểm ngữ pháp N5:`,
      ...analysis.grammarPoints.map(
        (gp) => `• ${gp.pattern}: ${gp.meaning}\n  ${gp.explanation}`
      ),
      ``,
      `Lưu ý thi JLPT N5:`,
      ...analysis.n5Tips.map((tip) => `• ${tip}`),
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save API key
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setGeminiApiKey(apiKeyInput.trim());
      setHasApiKey(true);
      setIsApiKeyModalOpen(false);
      handleReanalyze();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Drawer */}
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[560px] bg-white shadow-2xl border-l border-stone-200 flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-label="Phân tích ngữ pháp AI"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-indigo-950 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-wide">
                  Trợ lý Ngữ pháp AI
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  JLPT N5
                </span>
              </div>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                {cardTitle ? `Phân tích câu ví dụ thẻ: ${cardTitle}` : 'Phân tích ngữ pháp & từ loại chi tiết'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setApiKeyInput(getGeminiApiKey());
                setIsApiKeyModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Cài đặt khóa Gemini AI"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleReanalyze}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Phân tích lại bằng AI"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-stone-50/60">
          {/* Sentence Hero Card */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs relative group">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                  Câu ví dụ thực tế
                </span>
                <p className="text-base sm:text-lg font-bold text-stone-900 font-japanese leading-relaxed">
                  {sentence}
                </p>
                {reading && (
                  <p className="text-xs text-stone-500 font-japanese">
                    {reading}
                  </p>
                )}
                {vietnamese && (
                  <p className="text-xs font-medium text-stone-700 pt-0.5 border-t border-stone-100 mt-1">
                    {vietnamese}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 shrink-0 pt-1">
                <button
                  onClick={() => speakJapanese(sentence)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 transition-colors cursor-pointer"
                  title="Nghe phát âm chuẩn tiếng Nhật"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyAnalysis}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  title="Sao chép toàn bộ phân tích"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Loading state skeleton */}
          {isLoading && (
            <div className="p-6 bg-white rounded-2xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center gap-3 text-center py-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin" />
                <Sparkles className="w-4 h-4 text-indigo-600 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-800">
                  AI đang bóc tách ngữ pháp & cấu trúc câu...
                </p>
                <p className="text-[11px] text-stone-500 max-w-xs">
                  Phân tích từng từ loại, trợ từ, dạng chia động từ và mẹo thi N5
                </p>
              </div>
            </div>
          )}

          {/* Analysis Content */}
          {!isLoading && analysis && (
            <>
              {/* Card 1: Sentence Structure Blueprint */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Sơ đồ cấu trúc câu (Blueprint)</span>
                </div>

                <div className="p-3 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-stone-50 rounded-xl border border-indigo-100/80">
                  <p className="text-xs font-semibold text-indigo-950 font-mono tracking-tight leading-relaxed">
                    {analysis.structureFormula}
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {analysis.overview}
                </p>
              </div>

              {/* Card 2: Deep Word & Part of Speech Breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Bóc tách từng từ & từ loại (Chi tiết N5)</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {analysis.words.length} thành phần
                  </span>
                </div>

                <div className="space-y-2.5">
                  {analysis.words.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50/80 hover:bg-stone-50 rounded-xl border border-stone-200/70 transition-all text-xs space-y-1.5"
                    >
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-stone-900 text-sm font-japanese">
                            {w.word}
                          </span>
                          {w.furigana && w.furigana !== w.word && (
                            <span className="text-xs text-stone-500 font-japanese">
                              【{w.furigana}】
                            </span>
                          )}
                          {w.romaji && (
                            <span className="text-[11px] text-stone-400 italic">
                              {w.romaji}
                            </span>
                          )}
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.partOfSpeech.includes('Trợ từ')
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : w.partOfSpeech.includes('Động từ')
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : w.partOfSpeech.includes('Tính từ')
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {w.partOfSpeech}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
                        <p className="text-stone-700">
                          <strong className="text-stone-900 font-medium">Nghĩa:</strong> {w.meaning}
                        </p>
                        <p className="text-stone-600">
                          <strong className="text-stone-900 font-medium">Vai trò:</strong> {w.role}
                        </p>
                        {w.conjugation && (
                          <div className="mt-1 p-2 bg-white rounded-lg border border-stone-200/80 text-[11px] text-indigo-900 bg-indigo-50/30">
                            <span className="font-semibold text-indigo-700">💡 Thể chia / Điểm lưu ý: </span>
                            {w.conjugation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Key N5 Grammar Points */}
              {analysis.grammarPoints && analysis.grammarPoints.length > 0 && (
                <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Mẫu ngữ pháp N5 trọng tâm</span>
                  </div>

                  <div className="space-y-2.5">
                    {analysis.grammarPoints.map((gp, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-purple-900 font-japanese text-sm">
                            {gp.pattern}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-200/60 text-purple-800">
                            {gp.jlptLevel || 'N5'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-stone-700">
                          {gp.meaning}
                        </p>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {gp.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 4: N5 Exam Tips & Memorization Tricks */}
              {analysis.n5Tips && analysis.n5Tips.length > 0 && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Lưu ý & Mẹo tránh bẫy thi JLPT N5</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {analysis.n5Tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px]">
              {hasApiKey ? 'Gemini 2.5 AI Active' : 'Sử dụng dữ liệu N5 chuẩn hóa'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </aside>

      {/* Modal Cài đặt Gemini API Key */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-60 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Cấu hình Google Gemini AI
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Nhập API key để phân tích sâu bằng mô hình Gemini mới nhất
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <p className="text-[10px] text-stone-400">
                Khóa được lưu cục bộ trên trình duyệt của bạn, hoàn toàn bảo mật.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <p className="font-medium text-stone-800">Chưa có API key?</p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
              >
                Lấy API Key hoàn toàn miễn phí tại Google AI Studio
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                Lưu & Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
