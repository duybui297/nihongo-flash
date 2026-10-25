import { Router, Request, Response } from 'express';
import { uploadMiddleware } from '../media';
import { badRequest } from '../http';

export const uploadRouter = Router();

// POST /api/upload - Upload image or video
uploadRouter.post('/', uploadMiddleware.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    throw badRequest('Không tìm thấy tệp tải lên');
  }

  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});
