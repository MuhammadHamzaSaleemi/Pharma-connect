import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';

// The stored extension comes from this allowlist, never from the client's filename, so an upload
// can't land as .html/.svg and be served as a page from /uploads.
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
};
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Directory under UPLOAD_DIR (served at /uploads) that holds one kind of upload. */
export function uploadsDir(subdir: string): string {
  return join(process.env['UPLOAD_DIR'] ?? join(process.cwd(), 'uploads'), subdir);
}

/** Multer options for a single image, stored on disk in `uploadsDir(subdir)`. */
export function imageUploadOptions(subdir: string): MulterOptions {
  const destination = uploadsDir(subdir);
  return {
    storage: diskStorage({
      destination: (_req, _file, callback) => {
        mkdirSync(destination, { recursive: true });
        callback(null, destination);
      },
      // fileFilter has already rejected anything not in the allowlist.
      filename: (_req, file, callback) => {
        callback(null, `${randomUUID()}${EXTENSION_BY_MIME_TYPE[file.mimetype]}`);
      },
    }),
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (_req, file, callback) => {
      if (!(file.mimetype in EXTENSION_BY_MIME_TYPE)) {
        callback(
          new BadRequestException('Unsupported file type. Use PNG, JPG, WEBP, or GIF.'),
          false,
        );
        return;
      }
      callback(null, true);
    },
  };
}
