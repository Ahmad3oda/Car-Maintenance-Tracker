import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { PhotosService } from './photos.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';

@ApiBearerAuth()
@ApiTags('Photos')
@Controller('uploads')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get(':folder/:filename')
  @ApiOperation({
    summary: 'A car, item or record photo, for the user who owns it',
  })
  @ApiProduces('image/jpeg', 'image/png', 'image/webp', 'image/gif')
  @ApiResponse({ status: 200, description: 'The image.' })
  @ApiResponse({ status: 401, description: 'Not logged in.' })
  @ApiResponse({ status: 404, description: 'No such photo for this user.' })
  async getPhoto(
    @CurrentUser() user: AuthUser,
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const photo = await this.photosService.findOwned(user.id, folder, filename);
    res.set({
      // Served with the stored image type only; never sniffed or run.
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
      // Private per user: no shared or on-disk caching.
      'Cache-Control': 'private, no-store',
    });
    return new StreamableFile(createReadStream(photo.path), {
      type: photo.contentType,
    });
  }
}
