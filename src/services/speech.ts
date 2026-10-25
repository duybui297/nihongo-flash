/**
 * Speech synthesis service for Japanese pronunciation
 */

let japaneseVoice: SpeechSynthesisVoice | null = null;

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

export function speakJapanese(text: string, rate: number = 0.9): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported in this browser');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const cleanText = text.trim();
      if (!cleanText) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = rate; // slightly slower for better learner comprehension
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

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
