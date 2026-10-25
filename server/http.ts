import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const notFound = (message: string) => new HttpError(404, message);

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Tệp vượt quá dung lượng cho phép' : err.message;
    res.status(400).json({ error: message });
    return;
  }
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
}
