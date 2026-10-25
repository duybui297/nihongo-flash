import { Router, Request, Response } from 'express';
import { getStorageStats } from '../media';

export const storageRouter = Router();

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

// GET /api/storage/stats - Storage stats
storageRouter.get('/stats', (_req: Request, res: Response) => {
  const stats = getStorageStats();

  const freeDiskString = stats.freeBytes !== null
    ? `> ${(stats.freeBytes / (1024 * 1024 * 1024)).toFixed(0)} GB`
    : '> 50 GB';

  res.json({
    totalBytes: stats.totalBytes,
    totalMB: formatBytes(stats.totalBytes),
    fileCount: stats.fileCount,
    freeDisk: freeDiskString,
    maxFileSize: `${(stats.maxFileBytes / (1024 * 1024)).toFixed(0)} MB / tệp`,
  });
});
