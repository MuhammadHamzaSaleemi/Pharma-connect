import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const BLOG_UPLOADS_DIR = join(
  process.env['UPLOAD_DIR'] ?? join(process.cwd(), 'uploads'),
  'blogs',
);

export const blogImageMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, callback) => {
      mkdirSync(BLOG_UPLOADS_DIR, { recursive: true });
      callback(null, BLOG_UPLOADS_DIR);
    },
    filename: (_req, file, callback) => {
      callback(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException('Unsupported file type. Use PNG, JPG, WEBP, or GIF.'),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
