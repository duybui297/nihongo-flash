import path from 'path';
import { fileURLToPath } from 'url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT) || 3000,
  basePath: (process.env.BASE_PATH || '').replace(/\/+$/, ''),
  isProduction: process.env.NODE_ENV === 'production',
  rootDir: ROOT_DIR,
  dataDir: path.resolve(ROOT_DIR, 'data'),
  uploadsDir: path.resolve(ROOT_DIR, 'uploads'),
  publicDir: path.resolve(ROOT_DIR, 'public'),
  distDir: path.resolve(ROOT_DIR, 'dist'),
  dbFile: path.resolve(ROOT_DIR, 'data', 'nihonflash.json'),
  /** JSON body limit – only small inline thumbnails (data URLs) travel in JSON now. */
  jsonBodyLimit: '10mb',
} as const;
