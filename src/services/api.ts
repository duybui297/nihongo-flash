import { Flashcard, Deck, StudyStatus } from '../types/flashcard';

export interface ServerHealth {
  status: string;
  uptime: number;
  cardsCount: number;
  decksCount: number;
  storageType: string;
  serverTime: string;
}

export const api = {
  // Check server health
  async checkHealth(): Promise<ServerHealth> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Không thể kết nối với máy chủ');
    return res.json();
  },

  // Bootstrap data (cards + decks)
  async getInitialData(): Promise<{ cards: Flashcard[]; decks: Deck[] }> {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Lỗi tải dữ liệu từ máy chủ');
    return res.json();
  },

  // Decks
  async getDecks(): Promise<Deck[]> {
    const res = await fetch('/api/decks');
    if (!res.ok) throw new Error('Lỗi lấy danh sách bộ thẻ');
    return res.json();
  },

  async createDeck(deck: Partial<Deck>): Promise<Deck> {
    const res = await fetch('/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deck),
    });
    if (!res.ok) throw new Error('Lỗi tạo bộ thẻ trên máy chủ');
    return res.json();
  },

  async updateDeck(id: string, deck: Partial<Deck>): Promise<Deck> {
    const res = await fetch(`/api/decks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deck),
    });
    if (!res.ok) throw new Error('Lỗi cập nhật bộ thẻ trên máy chủ');
    return res.json();
  },

  async deleteDeck(id: string): Promise<{ success: boolean; fallbackDeckId: string }> {
    const res = await fetch(`/api/decks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi xoá bộ thẻ trên máy chủ');
    }
    return res.json();
  },

  // Flashcards
  async getFlashcards(filters?: { deckId?: string; jlpt?: string; status?: string; search?: string }): Promise<Flashcard[]> {
    const params = new URLSearchParams();
    if (filters?.deckId) params.append('deckId', filters.deckId);
    if (filters?.jlpt) params.append('jlpt', filters.jlpt);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`/api/flashcards?${params.toString()}`);
    if (!res.ok) throw new Error('Lỗi lấy danh sách flashcard');
    return res.json();
  },

  async getFlashcard(id: string): Promise<Flashcard> {
    const res = await fetch(`/api/flashcards/${id}`);
    if (!res.ok) throw new Error('Không tìm thấy thẻ trên máy chủ');
    return res.json();
  },

  async saveFlashcard(card: Flashcard): Promise<Flashcard> {
    const isExisting = card.id && !card.id.startsWith('temp-');
    // Check if card exists by trying PUT, else POST
    const method = isExisting ? 'PUT' : 'POST';
    const url = isExisting ? `/api/flashcards/${card.id}` : '/api/flashcards';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });

    if (!res.ok && method === 'PUT') {
      // If PUT failed with 404, fallback to POST
      const postRes = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
      if (!postRes.ok) throw new Error('Lỗi lưu thẻ lên máy chủ');
      return postRes.json();
    }

    if (!res.ok) throw new Error('Lỗi lưu thẻ lên máy chủ');
    return res.json();
  },

  async updateCardStatus(id: string, status: StudyStatus): Promise<Flashcard> {
    const res = await fetch(`/api/flashcards/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Lỗi cập nhật trạng thái thẻ');
    return res.json();
  },

  async deleteFlashcard(id: string): Promise<void> {
    const res = await fetch(`/api/flashcards/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Lỗi xoá thẻ khỏi máy chủ');
  },

  // Direct Server File Upload (Image / Video)
  async uploadFile(file: File): Promise<{ url: string; filename: string; mimetype: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi tải tệp lên máy chủ');
    }
    return res.json();
  },

  // Backup & Restore
  async exportBackup(): Promise<string> {
    const res = await fetch('/api/backup/export');
    if (!res.ok) throw new Error('Lỗi xuất bản sao lưu từ máy chủ');
    return res.text();
  },

  async importBackup(jsonData: string): Promise<{ success: boolean; decksCount: number; cardsCount: number }> {
    const parsed = JSON.parse(jsonData);
    const res = await fetch('/api/backup/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khôi phục sao lưu lên máy chủ');
    }
    return res.json();
  },

  async resetToSample(): Promise<{ cards: Flashcard[]; decks: Deck[] }> {
    const res = await fetch('/api/backup/reset', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Lỗi đặt lại dữ liệu mẫu trên máy chủ');
    const data = await res.json();
    return { cards: data.cards, decks: data.decks };
  },

  async clearAllData(): Promise<{ cards: Flashcard[]; decks: Deck[] }> {
    const res = await fetch('/api/backup/clear', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Lỗi xoá sạch toàn bộ dữ liệu trên máy chủ');
    const data = await res.json();
    return { cards: data.cards, decks: data.decks };
  },

  async getStorageStats(): Promise<{
    totalBytes: number;
    totalMB: string;
    fileCount: number;
    freeDisk: string;
    maxFileSize: string;
  }> {
    try {
      const res = await fetch('/api/storage/stats');
      if (!res.ok) throw new Error('Lỗi lấy thông tin bộ nhớ');
      return res.json();
    } catch {
      return {
        totalBytes: 0,
        totalMB: '0 MB',
        fileCount: 0,
        freeDisk: '> 180 GB',
        maxFileSize: '100 MB / tệp',
      };
    }
  },

  async syncWithServer(localCards: Flashcard[]): Promise<{ cards: Flashcard[]; decks: Deck[] }> {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: localCards }),
      });
      if (!res.ok) throw new Error('Lỗi đồng bộ dữ liệu');
      return res.json();
    } catch {
      return api.getInitialData();
    }
  },
};
