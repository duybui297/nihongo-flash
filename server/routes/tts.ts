import { Router, Request, Response } from 'express';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export const ttsRouter = Router();

async function synthesizeEdgeSpeech(text: string, voice: string = 'ja-JP-NanamiNeural'): Promise<Buffer> {
  const tts = new MsEdgeTTS({ enableLogger: false, connectionTimeoutMs: 8000 });
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);

  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    audioStream.on('end', () => {
      tts.close();
      resolve(Buffer.concat(chunks));
    });
    audioStream.on('error', (err) => {
      tts.close();
      reject(err);
    });
  });
}

// Fallback to Google Translate TTS if Edge TTS fails
async function fallbackGoogleTts(text: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
  });
  if (!res.ok) {
    throw new Error(`Google TTS fallback failed (${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

ttsRouter.all('/', async (req: Request, res: Response) => {
  const text = (req.method === 'POST' ? req.body?.text : req.query?.text) as string;
  const voice = ((req.method === 'POST' ? req.body?.voice : req.query?.voice) as string) || 'ja-JP-NanamiNeural';

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Thiếu text cần đọc tiếng Nhật' });
    return;
  }

  const cleanText = text.trim().slice(0, 500);

  try {
    const buffer = await synthesizeEdgeSpeech(cleanText, voice);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(buffer);
  } catch (edgeErr) {
    console.warn('[TTS] Edge TTS failed, falling back to Google TTS:', edgeErr);
    try {
      const buffer = await fallbackGoogleTts(cleanText);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    } catch (fallbackErr: any) {
      console.error('[TTS] Both Edge & Google TTS failed:', fallbackErr);
      res.status(500).json({ error: 'Không thể tạo âm thanh giọng đọc' });
    }
  }
});
