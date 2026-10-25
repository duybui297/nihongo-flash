import express, { Request, Response } from 'express';
import path from 'path';
import { config } from './config';
import { readDatabase } from './db';
import { ensureStorageDirs } from './media';
import { errorHandler } from './http';
import { decksRouter } from './routes/decks';
import { flashcardsRouter } from './routes/flashcards';
import { uploadRouter } from './routes/upload';
import { backupRouter } from './routes/backup';
import { storageRouter } from './routes/storage';

ensureStorageDirs();

const app = express();

app.use(express.json({ limit: config.jsonBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.jsonBodyLimit }));

// Serve static assets
app.use('/assets', express.static(path.resolve(config.publicDir, 'assets')));
app.use('/public', express.static(config.publicDir));
app.use('/uploads', express.static(config.uploadsDir));

// API routes
app.get('/api/health', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    cardsCount: db.cards.length,
    decksCount: db.decks.length,
    storageType: 'Server Filesystem JSON + Media Uploads',
    serverTime: new Date().toISOString(),
  });
});

app.get('/api/data', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    decks: db.decks,
    cards: db.cards,
  });
});

// Backward-compatible sync endpoint (server is source of truth)
app.post('/api/sync', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    decks: db.decks,
    cards: db.cards,
    syncedAt: new Date().toISOString(),
  });
});

app.use('/api/decks', decksRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/backup', backupRouter);
app.use('/api/storage', storageRouter);

// Centralized error handler
app.use(errorHandler);

// Vite SPA Integration
async function startServer() {
  if (!config.isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(config.distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(config.distDir, 'index.html'));
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[NihonFlash Server] Running on http://0.0.0.0:${config.port}`);
    console.log(`[Storage] Database path: ${config.dbFile}`);
  });
}

startServer().catch((err) => {
  console.error('[NihonFlash Server] Failed to start:', err);
  process.exit(1);
});
