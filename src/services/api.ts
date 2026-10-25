import type {
  Flashcard,
  Deck,
  StudyStatus,
  UploadResult,
  AppData,
} from '../types/flashcard';
import { uploadToCloudinary } from './cloudinary';

export interface ServerHealth {
  status: string;
  uptime: number;
  cardsCount: number;
  decksCount: number;
  storageType: string;
  serverTime: string;
}

export interface ClientStorageStats {
  totalBytes: number;
  totalMB: string;
  fileCount: number;
  freeDisk: string;
  maxFileSize: string;
}

const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(url), init);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = (errorBody && typeof errorBody === 'object' && 'error' in errorBody && typeof errorBody.error === 'string')
      ? errorBody.error
      : `Yêu cầu thất bại (${res.status})`;
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  // Server health
  async checkHealth(): Promise<ServerHealth> {
    return request<ServerHealth>('/api/health');
  },

  // Bootstrap data
  async getInitialData(): Promise<AppData> {
    return request<AppData>('/api/data');
  },

  // Decks
  async getDecks(): Promise<Deck[]> {
    return request<Deck[]>('/api/decks');
  },

  async createDeck(deck: Partial<Deck>): Promise<Deck> {
    return request<Deck>('/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deck),
    });
  },

  async updateDeck(id: string, deck: Partial<Deck>): Promise<Deck> {
    return request<Deck>(`/api/decks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deck),
    });
  },

  async deleteDeck(id: string): Promise<{ success: boolean; fallbackDeckId: string }> {
    return request<{ success: boolean; fallbackDeckId: string }>(`/api/decks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Flashcards
  async getFlashcards(filters?: { deckId?: string; jlpt?: string; status?: string; search?: string }): Promise<Flashcard[]> {
    const params = new URLSearchParams();
    if (filters?.deckId) params.append('deckId', filters.deckId);
    if (filters?.jlpt) params.append('jlpt', filters.jlpt);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return request<Flashcard[]>(`/api/flashcards${query ? `?${query}` : ''}`);
  },

  async getFlashcard(id: string): Promise<Flashcard> {
    return request<Flashcard>(`/api/flashcards/${encodeURIComponent(id)}`);
  },

  async saveFlashcard(card: Flashcard): Promise<Flashcard> {
    const isExisting = Boolean(card.id && !card.id.startsWith('temp-'));
    if (isExisting) {
      try {
        return await request<Flashcard>(`/api/flashcards/${encodeURIComponent(card.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(card),
        });
      } catch (err: unknown) {
        // Fallback to POST if 404
        if (err instanceof Error && err.message.includes('404')) {
          return request<Flashcard>('/api/flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(card),
          });
        }
        throw err;
      }
    }

    return request<Flashcard>('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
  },

  async updateCardStatus(id: string, status: StudyStatus): Promise<Flashcard> {
    return request<Flashcard>(`/api/flashcards/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  async deleteFlashcard(id: string): Promise<void> {
    await request<{ success: boolean }>(`/api/flashcards/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Upload
  async uploadFile(file: File): Promise<UploadResult> {
    try {
      const cloudRes = await uploadToCloudinary(file);
      return {
        url: cloudRes.secure_url,
        filename: file.name,
        mimetype: file.type,
        size: cloudRes.bytes || file.size,
      };
    } catch (cloudErr) {
      console.warn('[Upload] Cloudinary upload error, trying local server fallback:', cloudErr);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(apiUrl('/api/upload'), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody?.error || 'Lỗi tải tệp lên máy chủ';
        throw new Error(message);
      }
      return res.json();
    }
  },

  // Backup & Restore
  async exportBackup(): Promise<string> {
    const res = await fetch('/api/backup/export');
    if (!res.ok) throw new Error('Lỗi xuất bản sao lưu từ máy chủ');
    return res.text();
  },

  async importBackup(jsonData: string): Promise<{ success: boolean; decksCount: number; cardsCount: number }> {
    const parsed = JSON.parse(jsonData);
    return request<{ success: boolean; decksCount: number; cardsCount: number }>('/api/backup/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
  },

  async resetToSample(): Promise<AppData> {
    return request<AppData>('/api/backup/reset', {
      method: 'POST',
    });
  },

  async clearAllData(): Promise<AppData> {
    return request<AppData>('/api/backup/clear', {
      method: 'POST',
    });
  },

  async getStorageStats(): Promise<ClientStorageStats> {
    try {
      return await request<ClientStorageStats>('/api/storage/stats');
    } catch {
      return {
        totalBytes: 0,
        totalMB: '0 MB',
        fileCount: 0,
        freeDisk: '> 50 GB',
        maxFileSize: '50 MB / tệp',
      };
    }
  },
};
