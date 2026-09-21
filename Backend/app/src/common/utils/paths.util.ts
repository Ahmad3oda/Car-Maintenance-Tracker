import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function getDataDir(): string {
  return process.env.DATA_DIR || process.cwd();
}

export function getDbPath(): string {
  return process.env.DB_PATH || join(getDataDir(), 'data.sqlite');
}

export function getUploadDir(): string {
  return process.env.UPLOAD_DIR || join(getDataDir(), 'uploads');
}

export function ensureUploadDir(): string {
  const uploadDir = getUploadDir();
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}
