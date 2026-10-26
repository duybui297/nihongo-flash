/**
 * Speech synthesis & Audio service for Japanese pronunciation.
 * Supports both Cloudinary Studio AI Audio (MP3) and local Web Speech API fallback.
 */

let japaneseVoice: SpeechSynthesisVoice | null = null;
let currentAudio: HTMLAudioElement | null = null;

function loadJapaneseVoice(): Promise<SpeechSynthesisVoice | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(null);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const ja = voices.find((v) => v.lang.startsWith('ja') || v.lang === 'ja_JP' || v.lang === 'ja-JP');
    if (ja) {
      japaneseVoice = ja;
      resolve(ja);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      const updated = window.speechSynthesis.getVoices();
      const found = updated.find((v) => v.lang.startsWith('ja') || v.lang === 'ja_JP' || v.lang === 'ja-JP');
      japaneseVoice = found || null;
      resolve(japaneseVoice);
    };

    setTimeout(() => {
      resolve(japaneseVoice);
    }, 1000);
  });
}

// Initial voice scan
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadJapaneseVoice();
}

/**
 * Stop any current audio or speech synthesis
 */
export function stopSpeaking(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Play Japanese speech. If `audioUrl` is provided (e.g. from Cloudinary),
 * plays studio audio first. Otherwise falls back to browser Web Speech API.
 */
export function speakJapanese(
  text: string,
  audioUrl?: string,
  rate: number = 0.9
): Promise<boolean> {
  stopSpeaking();

  // If a pre-recorded AI audio URL is available, play it directly
  if (audioUrl && typeof audioUrl === 'string' && audioUrl.trim()) {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(audioUrl.trim());
        currentAudio = audio;
        audio.onended = () => {
          currentAudio = null;
          resolve(true);
        };
        audio.onerror = () => {
          console.warn('[Speech] Audio URL failed, falling back to Web Speech API');
          currentAudio = null;
          speakWithWebSpeech(text, rate).then(resolve);
        };
        audio.play().catch((err) => {
          console.warn('[Speech] Audio play was prevented or failed:', err);
          speakWithWebSpeech(text, rate).then(resolve);
        });
      } catch {
        speakWithWebSpeech(text, rate).then(resolve);
      }
    });
  }

  return speakWithWebSpeech(text, rate);
}

function speakWithWebSpeech(text: string, rate: number = 0.9): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported in this browser');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleanText = text.trim();
      if (!cleanText) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const ja = voices.find((v) => v.lang.startsWith('ja'));
        if (ja) utterance.voice = ja;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech error:', err);
      resolve(false);
    }
  });
}
