import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { getUploadDir } from './paths.util';

/** Image types browsers display; SVG is excluded because it can run script. */
export const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Names the upload code produces: UUID + an accepted image extension. */
export const PHOTO_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z]+$/;

/** True only for names this server generated; rules out paths like "../x". */
export const isUploadedPhotoName = (name: unknown): name is string =>
  typeof name === 'string' && PHOTO_NAME.test(name);

export const createMulterStorage = (subfolder: string) => {
  const destination = join(getUploadDir(), subfolder);
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  return diskStorage({
    destination: (req, file, cb) => {
      if (!existsSync(destination)) {
        mkdirSync(destination, { recursive: true });
      }
      cb(null, destination);
    },
    // Random UUID names cannot be guessed. The extension comes from the
    // accepted MIME type, never the client's file name, so an upload can't
    // be served back as HTML or script.
    filename: (req, file, cb) => {
      cb(null, `${randomUUID()}${IMAGE_EXTENSIONS[file.mimetype]}`);
    },
  });
};

export const imageFileFilter: MulterOptions['fileFilter'] = (req, file, cb) => {
  if (IMAGE_EXTENSIONS[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Only JPEG, PNG, WebP or GIF images can be uploaded',
      ),
      false,
    );
  }
};

/** Multer options for photo uploads: images only, at most 5 MB, one file. */
export const createImageUploadOptions = (subfolder: string): MulterOptions => ({
  storage: createMulterStorage(subfolder),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
});

export const deleteUploadedFile = async (
  subfolder: string,
  filename?: string | null,
): Promise<void> => {
  // Never unlink anything but a file name this server generated.
  if (!isUploadedPhotoName(filename)) return;
  try {
    const filePath = join(getUploadDir(), subfolder, filename);
    await fs.unlink(filePath);
  } catch {
    // Ignore if file doesn't exist or already removed
  }
};
