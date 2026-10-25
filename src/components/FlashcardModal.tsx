import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Volume2,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  FileText,
} from 'lucide-react';
import type { Flashcard, Deck, JLPTLevel, CardCategory, ExampleSentence } from '../types/flashcard';
import { JLPT_LEVELS, CARD_CATEGORIES, UPLOAD_ACCEPT_IMAGE, UPLOAD_ACCEPT_VIDEO } from '../types/flashcard';
import { readFileAsDataUrl, optimizeImageDataUrl, extractVideoThumbnail } from '../utils/media';
import { speakJapanese } from '../services/speech';
import { api } from '../services/api';
import { createId } from '../../shared/utils';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Flashcard) => Promise<Flashcard | void>;
  initialCard?: Flashcard | null;
  decks: Deck[];
  defaultDeckId?: string;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCard,
  decks,
  defaultDeckId,
}) => {
  const [deckId, setDeckId] = useState<string>(decks[0]?.id || 'deck-n5-basic');
  const [title, setTitle] = useState('');
  const [japanese, setJapanese] = useState('');
  const [reading, setReading] = useState('');
  const [meaning, setMeaning] = useState('');
  const [jlpt, setJlpt] = useState<JLPTLevel>('N5');
  const [category, setCategory] = useState<CardCategory>('Từ vựng');
  const [description, setDescription] = useState('');

  // Media states
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');

  // URL inputs
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  // Example sentences
  const [examples, setExamples] = useState<ExampleSentence[]>([]);

  // Processing states
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCard) {
      setDeckId(initialCard.deckId);
      setTitle(initialCard.title);
      setJapanese(initialCard.japanese);
      setReading(initialCard.reading);
      setMeaning(initialCard.meaning);
      setJlpt(initialCard.jlpt);
      setCategory(initialCard.category);
      setDescription(initialCard.description || '');
      setImageUrl(initialCard.imageUrl || '');
      setVideoUrl(initialCard.videoUrl || '');
      setThumbnailUrl(initialCard.thumbnailUrl || '');
      setExamples(initialCard.examples || []);
      setCustomImageUrl(initialCard.imageUrl || '');
      setCustomVideoUrl(initialCard.videoUrl || '');
    } else {
      // Defaults for new card
      setDeckId(defaultDeckId && defaultDeckId !== 'all' ? defaultDeckId : decks[0]?.id || 'deck-n5-basic');
      setTitle('');
      setJapanese('');
      setReading('');
      setMeaning('');
      setJlpt('N5');
      setCategory('Từ vựng');
      setDescription('');
      setImageUrl('');
      setVideoUrl('');
      setThumbnailUrl('');
      setExamples([]);
      setCustomImageUrl('');
      setCustomVideoUrl('');
    }
    setErrorMessage('');
  }, [initialCard, isOpen, defaultDeckId, decks]);

  if (!isOpen) return null;

  // Auto-fill title helper
  const handleAutoFillTitle = () => {
    if (japanese && reading && meaning) {
      setTitle(`${japanese} (${reading}) - ${meaning}`);
    } else if (japanese && meaning) {
      setTitle(`${japanese} - ${meaning}`);
    } else if (japanese) {
      setTitle(japanese);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessingMedia(true);
      setErrorMessage('');

      // Try uploading directly to Express server
      try {
        const uploadResult = await api.uploadFile(file);
        setImageUrl(uploadResult.url);
        if (!thumbnailUrl) {
          setThumbnailUrl(uploadResult.url);
        }
        return;
      } catch (serverErr) {
        console.warn('Server direct upload fallback to optimized data URL:', serverErr);
      }

      // Fallback to client-optimized data URL
      const rawDataUrl = await readFileAsDataUrl(file);
      const optimized = await optimizeImageDataUrl(rawDataUrl, 1000, 1000, 0.85);
      setImageUrl(optimized);
      if (!thumbnailUrl) {
        setThumbnailUrl(optimized);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể tải ảnh lên. Vui lòng thử lại với định dạng JPG, PNG hoặc WebP.');
    } finally {
      setIsProcessingMedia(false);
    }
  };

  // Video Upload handler
  const handleVideoUpload = async (file: File) => {
    try {
      setIsProcessingMedia(true);
      setErrorMessage('');

      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('Video quá lớn (>50MB). Bạn có thể nén video hoặc dán đường dẫn link video trực tuyến.');
        setIsProcessingMedia(false);
        return;
      }

      // Automatically generate a thumbnail from video frame before upload
      const thumb = await extractVideoThumbnail(file, 0.5);
      if (thumb && !thumbnailUrl) {
        setThumbnailUrl(thumb);
      }

      try {
        const uploadResult = await api.uploadFile(file);
        setVideoUrl(uploadResult.url);
        return;
      } catch (serverErr) {
        console.warn('Server direct video upload fallback to data URL:', serverErr);
      }

      const videoDataUrl = await readFileAsDataUrl(file);
      setVideoUrl(videoDataUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage('Lỗi xử lý video. Vui lòng thử tệp MP4 hoặc WebM.');
    } finally {
      setIsProcessingMedia(false);
    }
  };

  // Extract thumbnail from current video
  const handleCaptureVideoThumbnail = async () => {
    if (!videoUrl) return;
    try {
      setIsProcessingMedia(true);
      const thumb = await extractVideoThumbnail(videoUrl, 1.0);
      if (thumb) {
        setThumbnailUrl(thumb);
      } else {
        setErrorMessage('Không thể trích xuất khung hình từ video này.');
      }
    } catch {
      setErrorMessage('Lỗi trích xuất khung hình.');
    } finally {
      setIsProcessingMedia(false);
    }
  };

  // Add example sentence
  const handleAddExample = () => {
    setExamples((prev) => [
      ...prev,
      {
        id: createId('ex'),
        japanese: '',
        reading: '',
        vietnamese: '',
      },
    ]);
  };

  const handleUpdateExample = (id: string, field: keyof ExampleSentence, value: string) => {
    setExamples((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleRemoveExample = (id: string) => {
    setExamples((prev) => prev.filter((ex) => ex.id !== id));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !japanese.trim()) {
      setErrorMessage('Vui lòng nhập ít nhất Tiêu đề hoặc Từ vựng / Chữ Hán');
      return;
    }

    const finalTitle = title.trim() || `${japanese} - ${meaning || reading || 'Thẻ học'}`;
    const finalThumbnail = thumbnailUrl || imageUrl || '';

    const newCard: Flashcard = {
      id: initialCard?.id || createId('card'),
      deckId,
      title: finalTitle,
      japanese: japanese.trim() || finalTitle,
      reading: reading.trim(),
      meaning: meaning.trim(),
      jlpt,
      category,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      thumbnailUrl: finalThumbnail.trim() || undefined,
      examples: examples.filter((ex) => ex.japanese.trim() || ex.vietnamese.trim()),
      status: initialCard?.status || 'new',
      reviewCount: initialCard?.reviewCount || 0,
      lastReviewedAt: initialCard?.lastReviewedAt,
      createdAt: initialCard?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      setIsSaving(true);
      await onSave(newCard);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể lưu thẻ lên máy chủ. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              {initialCard ? 'Cập nhật Flashcard Tiếng Nhật' : 'Thêm Flashcard Tiếng Nhật Mới'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Cập nhật nội dung học, tải hình ảnh & video minh họa, khung mô tả chi tiết
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <FileText className="w-4 h-4 text-rose-500" />
              1. Thông tin từ vựng / Chữ Hán
            </h3>

            {/* Deck & JLPT & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bộ thẻ (Deck)
                </label>
                <select
                  value={deckId}
                  onChange={(e) => setDeckId(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white"
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.icon || '📁'} {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cấp độ JLPT
                </label>
                <select
                  value={jlpt}
                  onChange={(e) => setJlpt(e.target.value as JLPTLevel)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white"
                >
                  {JLPT_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phân loại
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CardCategory)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white"
                >
                  {CARD_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title (Primary requested field for list view) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Tiêu đề hiển thị ở danh sách <span className="text-rose-500">*</span>
                  <span className="text-xs font-normal text-stone-400 ml-1.5">(Title cho danh sách)</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillTitle}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Tự động điền theo từ vựng
                </button>
              </div>
              <input
                type="text"
                placeholder="VD: 桜 (Sakura) - Hoa anh đào"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white font-medium"
                required
              />
            </div>

            {/* Japanese Text, Reading, Meaning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Từ gốc / Chữ Hán
                  </label>
                  {japanese && (
                    <button
                      type="button"
                      onClick={() => speakJapanese(japanese)}
                      className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                      title="Nghe phát âm tiếng Nhật"
                    >
                      <Volume2 className="w-3 h-3" />
                      Phát âm
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="VD: 桜 hoặc 食べる"
                  value={japanese}
                  onChange={(e) => setJapanese(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white font-japanese font-semibold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Cách đọc (Furigana / Hiragana)
                  </label>
                  {reading && (
                    <button
                      type="button"
                      onClick={() => speakJapanese(reading)}
                      className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3 h-3" />
                      Nghe
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="VD: さくら / sakura"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white font-japanese"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nghĩa tiếng Việt
                </label>
                <input
                  type="text"
                  placeholder="VD: Hoa anh đào"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Khung mô tả (User explicit requirement) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Khung mô tả chi tiết
                <span className="text-xs font-normal text-stone-400 ml-1.5">
                  (Bộ thủ, nguồn gốc chữ Hán, mẹo nhớ, cấu trúc ngữ pháp, lưu ý văn hóa...)
                </span>
              </label>
              <textarea
                rows={4}
                placeholder="Nhập giải thích chi tiết tại đây:
- Nguồn gốc chữ Hán / Bộ thủ tạo thành
- Mẹo ghi nhớ câu chuyện
- Ngữ cảnh giao tiếp và lưu ý kính ngữ
- Cụm từ hay đi kèm..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-800 focus:ring-2 focus:ring-rose-500 focus:bg-white leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Section 2: Media Upload (Image & Video) */}
          <div className="space-y-4 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <VideoIcon className="w-4 h-4 text-rose-500" />
                2. Hình ảnh & Video minh hoạ & Thumbnail
              </h3>
              <div className="flex bg-stone-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMediaTab('image')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    mediaTab === 'image'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  Hình ảnh
                  {imageUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('video')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    mediaTab === 'video'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <VideoIcon className="w-3.5 h-3.5 text-indigo-500" />
                  Video minh hoạ
                  {videoUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
              </div>
            </div>

            {/* IMAGE TAB CONTENT */}
            {mediaTab === 'image' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                {/* Upload or Link */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-700 block">
                    Tải lên hình ảnh từ thiết bị
                  </span>

                  <input
                    type="file"
                    ref={imageFileInputRef}
                    accept={UPLOAD_ACCEPT_IMAGE}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />

                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-rose-400 bg-white hover:bg-rose-50/20 p-5 rounded-xl text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-stone-400" />
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-rose-600">Nhấn để tải ảnh lên</span> hoặc kéo thả vào đây
                    </div>
                    <span className="text-[10px] text-stone-400">PNG, JPG, WebP, GIF (tối đa 50MB)</span>
                  </div>

                  {/* Or image URL */}
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Hoặc dán đường dẫn ảnh trực tuyến (URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customImageUrl.trim()) {
                            setImageUrl(customImageUrl.trim());
                            if (!thumbnailUrl) setThumbnailUrl(customImageUrl.trim());
                          }
                        }}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                <div>
                  <span className="text-xs font-bold text-stone-700 block mb-2">
                    Xem trước hình ảnh
                  </span>
                  {imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 group aspect-video flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setThumbnailUrl(imageUrl)}
                          className="px-2 py-1 bg-black/70 hover:bg-black text-white text-[10px] font-medium rounded-md backdrop-blur-xs flex items-center gap-1"
                          title="Dùng làm thumbnail ngoài danh sách"
                        >
                          <Camera className="w-3 h-3" />
                          Làm Thumbnail
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs"
                          title="Xóa hình ảnh"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-stone-200 bg-white rounded-xl aspect-video flex flex-col items-center justify-center text-stone-400 gap-1.5">
                      <ImageIcon className="w-8 h-8 stroke-1 text-stone-300" />
                      <span className="text-xs">Chưa có hình ảnh minh hoạ</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIDEO TAB CONTENT */}
            {mediaTab === 'video' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                {/* Upload or Link */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-700 block">
                    Tải lên video minh họa (MP4, WebM)
                  </span>

                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept={UPLOAD_ACCEPT_VIDEO}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoUpload(file);
                    }}
                  />

                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 p-5 rounded-xl text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-stone-400" />
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-indigo-600">Nhấn để tải video lên</span> hoặc kéo thả
                    </div>
                    <span className="text-[10px] text-stone-400">MP4, WebM (tối đa 50MB)</span>
                  </div>

                  {/* Video URL input */}
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Hoặc dán link video trực tuyến
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        value={customVideoUrl}
                        onChange={(e) => setCustomVideoUrl(e.target.value)}
                        className="flex-1 text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customVideoUrl.trim()) {
                            setVideoUrl(customVideoUrl.trim());
                          }
                        }}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Preview */}
                <div>
                  <span className="text-xs font-bold text-stone-700 block mb-2">
                    Xem trước video minh họa
                  </span>
                  {videoUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-black aspect-video flex items-center justify-center group">
                      <video
                        src={videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={handleCaptureVideoThumbnail}
                          disabled={isProcessingMedia}
                          className="px-2 py-1 bg-stone-900/80 hover:bg-black text-white text-[10px] font-medium rounded-md backdrop-blur-xs flex items-center gap-1 shadow-xs"
                          title="Tạo ảnh thumbnail từ khung hình video hiện tại"
                        >
                          <Camera className="w-3 h-3 text-amber-400" />
                          Trích Thumbnail
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoUrl('')}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs"
                          title="Xóa video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-stone-200 bg-white rounded-xl aspect-video flex flex-col items-center justify-center text-stone-400 gap-1.5">
                      <VideoIcon className="w-8 h-8 stroke-1 text-stone-300" />
                      <span className="text-xs">Chưa có video minh hoạ</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* THUMBNAIL DISPLAY SETTING */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg border border-amber-300 overflow-hidden bg-stone-900 shrink-0 flex items-center justify-center">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-stone-400 text-center px-1">Chưa có</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    Thumbnail hiển thị ngoài danh sách
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    {thumbnailUrl
                      ? 'Hình ảnh đại diện sẽ xuất hiện kèm Tiêu đề trong Danh sách thẻ.'
                      : 'Mẹo: Nhấn nút "Làm Thumbnail" từ ảnh hoặc "Trích Thumbnail" từ video.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={thumbnailFileInputRef}
                  accept={UPLOAD_ACCEPT_IMAGE}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const dataUrl = await readFileAsDataUrl(file);
                      const opt = await optimizeImageDataUrl(dataUrl, 500, 500, 0.85);
                      setThumbnailUrl(opt);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => thumbnailFileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 shadow-2xs"
                >
                  Chọn ảnh khác làm Thumbnail
                </button>
                {thumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl('')}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                    title="Xoá thumbnail riêng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Example Sentences */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                3. Các câu ví dụ thực tế (Reibun)
              </h3>
              <button
                type="button"
                onClick={handleAddExample}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm câu ví dụ
              </button>
            </div>

            {examples.length === 0 ? (
              <div className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-lg border border-dashed border-stone-200 text-center">
                Chưa có câu ví dụ nào. Nhấn "Thêm câu ví dụ" để bổ sung mẫu câu kèm phiên âm và nghĩa.
              </div>
            ) : (
              <div className="space-y-3">
                {examples.map((ex, index) => (
                  <div key={ex.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-600">
                        Ví dụ #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {ex.japanese && (
                          <button
                            type="button"
                            onClick={() => speakJapanese(ex.japanese)}
                            className="text-xs text-stone-600 hover:text-rose-600 flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            Nghe câu
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExample(ex.id)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Câu tiếng Nhật (Kanji/Kana)..."
                        value={ex.japanese}
                        onChange={(e) => handleUpdateExample(ex.id, 'japanese', e.target.value)}
                        className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-japanese font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Phiên âm / Romaji (tuỳ chọn)..."
                        value={ex.reading || ''}
                        onChange={(e) => handleUpdateExample(ex.id, 'reading', e.target.value)}
                        className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Dịch nghĩa tiếng Việt..."
                        value={ex.vietnamese}
                        onChange={(e) => handleUpdateExample(ex.id, 'vietnamese', e.target.value)}
                        className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving || isProcessingMedia}
              className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-lg shadow-sm shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              {isSaving ? 'Đang lưu trữ...' : initialCard ? 'Lưu thay đổi' : 'Thêm vào bộ thẻ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
