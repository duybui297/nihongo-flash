import express, { Request, Response, Router } from 'express';
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

const apiRouter = Router();

// Serve static assets
apiRouter.use('/assets', express.static(path.resolve(config.publicDir, 'assets')));
apiRouter.use('/public', express.static(config.publicDir));
apiRouter.use('/uploads', express.static(config.uploadsDir));

// API routes
apiRouter.get('/api/health', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    cardsCount: db.cards.length,
    decksCount: db.decks.length,
    basePath: config.basePath || '/',
    storageType: 'Server Filesystem JSON + Media Uploads',
    serverTime: new Date().toISOString(),
  });
});

apiRouter.get('/api/data', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    decks: db.decks,
    cards: db.cards,
  });
});

// Backward-compatible sync endpoint
apiRouter.post('/api/sync', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    decks: db.decks,
    cards: db.cards,
    syncedAt: new Date().toISOString(),
  });
});

apiRouter.use('/api/decks', decksRouter);
apiRouter.use('/api/flashcards', flashcardsRouter);
apiRouter.use('/api/upload', uploadRouter);
apiRouter.use('/api/backup', backupRouter);
apiRouter.use('/api/storage', storageRouter);

// Support both basePath (e.g. /products/nihongo-flash) and root mount
if (config.basePath) {
  app.use(config.basePath, apiRouter);
}
app.use('/', apiRouter);

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
    // Production SPA serving
    if (config.basePath) {
      app.use(config.basePath, express.static(config.distDir));
      app.get(`${config.basePath}/*`, (_req: Request, res: Response) => {
        res.sendFile(path.resolve(config.distDir, 'index.html'));
      });
      // Redirect exact basePath without trailing slash
      app.get(config.basePath, (_req: Request, res: Response) => {
        res.redirect(301, `${config.basePath}/`);
      });
    }

    app.use(express.static(config.distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(config.distDir, 'index.html'));
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[NihonFlash Server] Running on http://0.0.0.0:${config.port}`);
    if (config.basePath) {
      console.log(`[NihonFlash Server] Base path mounted at: ${config.basePath}`);
    }
    console.log(`[Storage] Database path: ${config.dbFile}`);
  });
}

startServer().catch((err) => {
  console.error('[NihonFlash Server] Failed to start:', err);
  process.exit(1);
});
