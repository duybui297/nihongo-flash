import { apiUrl } from './api';
import { uploadToCloudinary } from './cloudinary';

export const JAPANESE_VOICES = [
  { id: 'ja-JP-NanamiNeural', label: 'Nanami (Nữ - Ngọt ngào, tự nhiên)', gender: 'Female' },
  { id: 'ja-JP-KeitaNeural', label: 'Keita (Nam - Trầm ấm, chuẩn mực)', gender: 'Male' },
  { id: 'ja-JP-AoiNeural', label: 'Aoi (Nữ - Trong trẻo, thanh thoát)', gender: 'Female' },
  { id: 'ja-JP-DaichiNeural', label: 'Daichi (Nam - Truyền cảm, sống động)', gender: 'Male' },
] as const;

export type JapaneseVoiceId = typeof JAPANESE_VOICES[number]['id'];

/**
 * Synthesizes Japanese speech audio as a Blob (audio/mpeg)
 */
export async function synthesizeAudioBlob(
  text: string,
  voice: string = 'ja-JP-NanamiNeural'
): Promise<Blob> {
  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error('Vui lòng nhập văn bản tiếng Nhật');
  }

  // 1. Try serverless / local /api/tts endpoint
  try {
    const res = await fetch(apiUrl('/api/tts'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: cleanText, voice }),
    });

    if (res.ok) {
      const blob = await res.blob();
      if (blob.size > 500) {
        return blob;
      }
    }
  } catch (err) {
    console.warn('[TTS] /api/tts request failed, trying client fallback:', err);
  }

  // 2. Direct Fallback: Google Translate TTS MP3 stream
  try {
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(
      cleanText
    )}`;
    const res = await fetch(googleUrl);
    if (res.ok) {
      return await res.blob();
    }
  } catch (err) {
    console.warn('[TTS] Google TTS fallback failed:', err);
  }

  throw new Error('Không thể kết nối dịch vụ TTS để sinh âm thanh.');
}

/**
 * Synthesizes Japanese speech and uploads the resulting MP3 directly to Cloudinary.
 * Returns the permanent Cloudinary HTTPS audio URL.
 */
export async function synthesizeAndUploadAudio(
  text: string,
  voice: string = 'ja-JP-NanamiNeural',
  filenamePrefix = 'voice'
): Promise<string> {
  const blob = await synthesizeAudioBlob(text, voice);
  const file = new File([blob], `${filenamePrefix}_${Date.now()}.mp3`, {
    type: 'audio/mpeg',
  });

  const uploadRes = await uploadToCloudinary(file);
  return uploadRes.secure_url || uploadRes.url;
}
