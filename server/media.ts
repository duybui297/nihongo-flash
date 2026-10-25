import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ALLOWED_UPLOAD_MIME, MAX_UPLOAD_BYTES } from '../shared/constants';
import { createId } from '../shared/utils';
import type { DatabaseSchema, Flashcard, StorageStats } from '../shared/types';
import { config } from './config';
import { badRequest } from './http';

const UPLOAD_URL_PREFIX = '/uploads/';
const MEDIA_FIELDS = ['imageUrl', 'videoUrl', 'thumbnailUrl'] as const;
type MediaField = (typeof MEDIA_FIELDS)[number];

export function ensureStorageDirs(): void {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

function buildFilename(prefix: string, mimeType: string): string {
  return `${createId(prefix)}${ALLOWED_UPLOAD_MIME[mimeType]}`;
}

/** Multer instance for multipart uploads – only whitelisted image/video types are accepted. */
export const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, config.uploadsDir),
    filename: (_req, file, cb) => cb(null, buildFilename('media', file.mimetype)),
  }),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_UPLOAD_MIME[file.mimetype]) cb(null, true);
    else cb(badRequest(`Định dạng tệp không được hỗ trợ: ${file.mimetype}`));
  },
});

/** Converts a `data:` URL into a file under /uploads and returns its public URL. */
function saveDataUrl(dataUrl: string, prefix: string): string | undefined {
  const match = dataUrl.match(/^data:([\w.+-]+\/[\w.+-]+);base64,(.+)$/);
  if (!match || !ALLOWED_UPLOAD_MIME[match[1]]) return undefined;
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > MAX_UPLOAD_BYTES) return undefined;
  const filename = buildFilename(prefix, match[1]);
  fs.writeFileSync(path.join(config.uploadsDir, filename), buffer);
  return `${UPLOAD_URL_PREFIX}${filename}`;
}

/** Accepts uploaded paths, bundled assets and http(s) links; rejects anything else (e.g. `javascript:`). */
function normalizeMediaUrl(value: unknown, prefix: string): string | undefined {
  if (typeof value !== 'string') return undefined;
  const url = value.trim();
  if (!url) return undefined;
  if (url.startsWith('data:')) return saveDataUrl(url, prefix);
  if (url.startsWith(UPLOAD_URL_PREFIX) || url.startsWith('/assets/')) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return undefined;
}

const PREFIX_BY_FIELD: Record<MediaField, string> = {
  imageUrl: 'img',
  videoUrl: 'vid',
  thumbnailUrl: 'thumb',
};

/** Normalises all media fields of a (partial) card, persisting inline data URLs to disk. */
export function persistCardMedia<T extends Partial<Pick<Flashcard, MediaField>>>(card: T): T {
  const result = { ...card };
  for (const field of MEDIA_FIELDS) {
    if (field in result) {
      result[field] = normalizeMediaUrl(result[field], PREFIX_BY_FIELD[field]);
    }
  }
  return result;
}

function deleteUploadedFile(url?: string): void {
  if (!url?.startsWith(UPLOAD_URL_PREFIX)) return;
  const filePath = path.join(config.uploadsDir, path.basename(url));
  fs.rm(filePath, { force: true }, (err) => {
    if (err) console.error('[Media] Failed to delete', filePath, err);
  });
}

function collectReferencedUploads(db: DatabaseSchema): Set<string> {
  const urls = new Set<string>();
  for (const card of db.cards) {
    for (const field of MEDIA_FIELDS) {
      const url = card[field];
      if (url?.startsWith(UPLOAD_URL_PREFIX)) urls.add(url);
    }
  }
  return urls;
}

/** Deletes media from `previous` that is no longer referenced anywhere in the DB. */
export function deleteUnreferencedMedia(db: DatabaseSchema, previous: Partial<Flashcard>): void {
  const stillUsed = collectReferencedUploads(db);
  for (const field of MEDIA_FIELDS) {
    const url = previous[field];
    if (url && !stillUsed.has(url)) deleteUploadedFile(url);
  }
}

/** Removes every upload that is not referenced by any card (used after import/reset/clear). */
export function pruneOrphanUploads(db: DatabaseSchema): void {
  const referenced = collectReferencedUploads(db);
  for (const file of fs.readdirSync(config.uploadsDir)) {
    if (!referenced.has(`${UPLOAD_URL_PREFIX}${file}`)) deleteUploadedFile(`${UPLOAD_URL_PREFIX}${file}`);
  }
}

export function getStorageStats(): StorageStats {
  let totalBytes = 0;
  const files = fs.readdirSync(config.uploadsDir);
  for (const file of files) {
    try {
      totalBytes += fs.statSync(path.join(config.uploadsDir, file)).size;
    } catch {
      // File removed between readdir and stat – ignore.
    }
  }
  if (fs.existsSync(config.dbFile)) totalBytes += fs.statSync(config.dbFile).size;

  let freeBytes: number | null = null;
  try {
    const stats = fs.statfsSync(config.uploadsDir);
    freeBytes = stats.bavail * stats.bsize;
  } catch {
    // statfs is not available on every platform.
  }

  return { totalBytes, fileCount: files.length, freeBytes, maxFileBytes: MAX_UPLOAD_BYTES };
}
