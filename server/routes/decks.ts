import { Router, Request, Response } from 'express';
import { readDatabase, updateDatabase } from '../db';
import { badRequest, notFound } from '../http';
import { parseDeckInput } from '../validation';
import { createId } from '../../shared/utils';
import type { Deck } from '../../shared/types';
import { DEFAULT_DECK_COLOR, DEFAULT_DECK_ICON } from '../../shared/constants';

export const decksRouter = Router();

// GET /api/decks - List all decks
decksRouter.get('/', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json(db.decks);
});

// POST /api/decks - Create new deck
decksRouter.post('/', (req: Request, res: Response) => {
  const input = parseDeckInput(req.body, false);
  const now = new Date().toISOString();

  const newDeck: Deck = {
    id: typeof req.body.id === 'string' && req.body.id.trim() ? req.body.id.trim() : createId('deck'),
    name: input.name!,
    description: input.description ?? '',
    color: input.color ?? DEFAULT_DECK_COLOR,
    icon: input.icon ?? DEFAULT_DECK_ICON,
    createdAt: now,
  };

  updateDatabase((db) => {
    db.decks.push(newDeck);
  });

  res.status(201).json(newDeck);
});

// PUT /api/decks/:id - Update deck
decksRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const input = parseDeckInput(req.body, true);

  const updatedDeck = updateDatabase((db) => {
    const index = db.decks.findIndex((d) => d.id === id);
    if (index === -1) {
      throw notFound('Không tìm thấy bộ thẻ');
    }
    const current = db.decks[index];
    const updated: Deck = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
    };
    db.decks[index] = updated;
    return updated;
  });

  res.json(updatedDeck);
});

// DELETE /api/decks/:id - Delete deck & reassign cards to fallback deck
decksRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const result = updateDatabase((db) => {
    if (db.decks.length <= 1) {
      throw badRequest('Không thể xoá bộ thẻ duy nhất còn lại');
    }
    const exists = db.decks.some((d) => d.id === id);
    if (!exists) {
      throw notFound('Không tìm thấy bộ thẻ để xoá');
    }

    const remainingDecks = db.decks.filter((d) => d.id !== id);
    const fallbackDeckId = remainingDecks[0].id;

    // Reassign cards in this deck to fallback deck
    db.cards = db.cards.map((c) => (c.deckId === id ? { ...c, deckId: fallbackDeckId, updatedAt: new Date().toISOString() } : c));
    db.decks = remainingDecks;

    return { success: true, fallbackDeckId };
  });

  res.json(result);
});
