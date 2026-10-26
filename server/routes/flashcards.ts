import { Router, Request, Response } from 'express';
import { readDatabase, updateDatabase } from '../db';
import { notFound, badRequest } from '../http';
import { parseCardInput, isStudyStatus } from '../validation';
import { persistCardMedia, deleteUnreferencedMedia } from '../media';
import { createId, matchesSearch } from '../../shared/utils';
import type { Flashcard } from '../../shared/types';

export const flashcardsRouter = Router();

// GET /api/flashcards - List cards with optional filters
flashcardsRouter.get('/', (req: Request, res: Response) => {
  const db = readDatabase();
  const { deckId, jlpt, status, search } = req.query;

  let result = db.cards;
  if (deckId && deckId !== 'all') {
    result = result.filter((c) => c.deckId === deckId);
  }
  if (jlpt && jlpt !== 'all') {
    result = result.filter((c) => c.jlpt === jlpt);
  }
  if (status && status !== 'all') {
    result = result.filter((c) => c.status === status);
  }
  if (typeof search === 'string' && search.trim()) {
    result = result.filter((c) => matchesSearch(c, search));
  }

  res.json(result);
});

// GET /api/flashcards/:id - Get single card
flashcardsRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDatabase();
  const card = db.cards.find((c) => c.id === id);
  if (!card) {
    throw notFound('Không tìm thấy thẻ');
  }
  res.json(card);
});

// POST /api/flashcards - Create flashcard
flashcardsRouter.post('/', (req: Request, res: Response) => {
  const input = parseCardInput(req.body, false);
  const mediaHandled = persistCardMedia(input);
  const now = new Date().toISOString();

  const newCard: Flashcard = updateDatabase((db) => {
    // If deckId doesn't exist, assign first deck
    const targetDeckId = (mediaHandled.deckId && db.decks.some((d) => d.id === mediaHandled.deckId))
      ? mediaHandled.deckId
      : db.decks[0]?.id || 'deck-default';

    const card: Flashcard = {
      id: typeof req.body.id === 'string' && req.body.id.trim() ? req.body.id.trim() : createId('card'),
      deckId: targetDeckId,
      title: mediaHandled.title || mediaHandled.japanese || 'Thẻ mới',
      japanese: mediaHandled.japanese || mediaHandled.title || '',
      reading: mediaHandled.reading ?? '',
      meaning: mediaHandled.meaning ?? '',
      jlpt: mediaHandled.jlpt ?? 'N5',
      category: mediaHandled.category ?? 'Từ vựng',
      description: mediaHandled.description ?? '',
      imageUrl: mediaHandled.imageUrl,
      videoUrl: mediaHandled.videoUrl,
      thumbnailUrl: mediaHandled.thumbnailUrl || mediaHandled.imageUrl,
      audioUrl: mediaHandled.audioUrl,
      examples: mediaHandled.examples ?? [],
      status: 'new',
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.cards.unshift(card);
    return card;
  });

  res.status(201).json(newCard);
});

// PUT /api/flashcards/:id - Update flashcard
flashcardsRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const input = parseCardInput(req.body, true);
  const mediaHandled = persistCardMedia(input);
  const now = new Date().toISOString();

  const updatedCard = updateDatabase((db) => {
    const index = db.cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw notFound('Không tìm thấy thẻ cần cập nhật');
    }

    const previousCard = db.cards[index];
    const updated: Flashcard = {
      ...previousCard,
      ...mediaHandled,
      id: previousCard.id,
      createdAt: previousCard.createdAt,
      updatedAt: now,
    };

    db.cards[index] = updated;
    deleteUnreferencedMedia(db, previousCard);
    return updated;
  });

  res.json(updatedCard);
});

// PATCH /api/flashcards/:id/status - Update card study status
flashcardsRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!isStudyStatus(status)) {
    throw badRequest('Trạng thái học không hợp lệ');
  }

  const updatedCard = updateDatabase((db) => {
    const index = db.cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw notFound('Không tìm thấy thẻ');
    }

    const card = db.cards[index];
    card.status = status;
    card.reviewCount = (card.reviewCount || 0) + 1;
    card.lastReviewedAt = new Date().toISOString();
    card.updatedAt = new Date().toISOString();
    return card;
  });

  res.json(updatedCard);
});

// DELETE /api/flashcards/:id - Delete flashcard
flashcardsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  updateDatabase((db) => {
    const cardToDelete = db.cards.find((c) => c.id === id);
    if (!cardToDelete) {
      throw notFound('Không tìm thấy thẻ để xoá');
    }

    db.cards = db.cards.filter((c) => c.id !== id);
    deleteUnreferencedMedia(db, cardToDelete);
  });

  res.json({ success: true, message: 'Đã xoá thẻ và tệp đính kèm thành công' });
});
