import { Router, Request, Response } from 'express';
import { readDatabase, replaceDatabase } from '../db';
import { parseBackup } from '../validation';
import { pruneOrphanUploads, persistCardMedia } from '../media';
import { createSeedData } from '../../shared/seed';
import { DEFAULT_DECK_COLOR, DEFAULT_DECK_ICON } from '../../shared/constants';
import type { Deck } from '../../shared/types';

export const backupRouter = Router();

// GET /api/backup/export - Export database as JSON
backupRouter.get('/export', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=nihonflash-backup-${Date.now()}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// POST /api/backup/import - Import database
backupRouter.post('/import', (req: Request, res: Response) => {
  const parsed = parseBackup(req.body);

  // Normalize any base64 cards in the backup to files
  const normalizedCards = parsed.cards.map((c) => persistCardMedia(c));

  const newDb = replaceDatabase({
    decks: parsed.decks,
    cards: normalizedCards,
  });

  pruneOrphanUploads(newDb);

  res.json({
    success: true,
    decksCount: newDb.decks.length,
    cardsCount: newDb.cards.length,
  });
});

// POST /api/backup/reset - Reset to default sample seed
backupRouter.post('/reset', (_req: Request, res: Response) => {
  const seed = createSeedData();
  const newDb = replaceDatabase(seed);
  pruneOrphanUploads(newDb);
  res.json(newDb);
});

// POST /api/backup/clear - Wipes all cards and uploads completely (Fixes B2)
backupRouter.post('/clear', (_req: Request, res: Response) => {
  const emptyDefaultDeck: Deck = {
    id: 'deck-main',
    name: 'Từ vựng tiếng Nhật',
    description: 'Bộ thẻ mặc định',
    color: DEFAULT_DECK_COLOR,
    icon: DEFAULT_DECK_ICON,
    createdAt: new Date().toISOString(),
  };

  const newDb = replaceDatabase({
    decks: [emptyDefaultDeck],
    cards: [],
  });

  pruneOrphanUploads(newDb);

  res.json(newDb);
});
