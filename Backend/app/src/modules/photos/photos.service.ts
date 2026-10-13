import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { extname, join } from 'path';
import { DataSource } from 'typeorm';
import { Car } from '../cars/entities/car.entity';
import { Item } from '../items/entities/item.entity';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';
import { getUploadDir } from '../../common/utils/paths.util';
import { IMAGE_EXTENSIONS } from '../../common/utils/multer.util';

export const PHOTO_FOLDERS = ['cars', 'items', 'maintenance-records'] as const;
export type PhotoFolder = (typeof PHOTO_FOLDERS)[number];

/** Names the upload code produces: UUID + an accepted image extension. */
const PHOTO_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z]+$/;

const MIME_BY_EXTENSION: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGE_EXTENSIONS).map(([mime, ext]) => [ext, mime]),
);

export interface OwnedPhoto {
  path: string;
  contentType: string;
}

@Injectable()
export class PhotosService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * The photo file if it belongs to one of the user's cars, items or
   * records; otherwise 404, the same as a photo that does not exist.
   */
  async findOwned(
    userId: number,
    folder: string,
    filename: string,
  ): Promise<OwnedPhoto> {
    const contentType = MIME_BY_EXTENSION[extname(filename)];
    // The name check also rules out path traversal ("../").
    if (
      !PHOTO_FOLDERS.includes(folder as PhotoFolder) ||
      !PHOTO_NAME.test(filename) ||
      !contentType ||
      !(await this.isOwned(userId, folder as PhotoFolder, filename))
    ) {
      throw new NotFoundException('Photo not found');
    }

    const path = join(getUploadDir(), folder, filename);
    if (!existsSync(path)) {
      throw new NotFoundException('Photo not found');
    }
    return { path, contentType };
  }

  private isOwned(
    userId: number,
    folder: PhotoFolder,
    photoPath: string,
  ): Promise<boolean> {
    switch (folder) {
      case 'cars':
        return this.dataSource
          .getRepository(Car)
          .existsBy({ photoPath, userId });
      case 'items':
        return this.dataSource
          .getRepository(Item)
          .existsBy({ photoPath, car: { userId } });
      case 'maintenance-records':
        return this.dataSource
          .getRepository(MaintenanceRecord)
          .existsBy({ photoPath, car: { userId } });
    }
  }
}
