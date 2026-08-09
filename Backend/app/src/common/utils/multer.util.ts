import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';

export const createMulterStorage = (subfolder: string) => {
  const destination = join(process.cwd(), 'uploads', subfolder);
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
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  });
};

export const deleteUploadedFile = async (
  subfolder: string,
  filename?: string | null,
): Promise<void> => {
  if (!filename) return;
  try {
    const filePath = join(process.cwd(), 'uploads', subfolder, filename);
    await fs.unlink(filePath);
  } catch {
    // Ignore if file doesn't exist or already removed
  }
};
