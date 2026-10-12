import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createInMemoryApp } from '../../testing/in-memory-app';
import { MAX_UPLOAD_BYTES } from '../../common/utils/multer.util';

// Smallest valid PNG header is enough; multer checks the declared type.
const PNG = Buffer.from('89504e470d0a1a0a', 'hex');

describe('Car photo uploads (HTTP)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = (await createInMemoryApp()).createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const postCar = () =>
    request(app.getHttpServer())
      .post('/cars')
      .field('plateNumber', 'ABC123')
      .field('brand', 'Kia')
      .field('model', 'Rio')
      .field('year', '2020');

  it('stores an image with an extension taken from its type', async () => {
    const res = await postCar()
      .attach('photoPath', PNG, {
        filename: 'evil.html',
        contentType: 'image/png',
      })
      .expect(201);
    expect((res.body as { photoPath: string }).photoPath).toMatch(
      /^\d+-\d+\.png$/,
    );
  });

  it('rejects non-image files', async () => {
    const res = await postCar()
      .attach('photoPath', Buffer.from('<script>alert(1)</script>'), {
        filename: 'evil.html',
        contentType: 'text/html',
      })
      .expect(400);
    expect((res.body as { message: string }).message).toBe(
      'Only JPEG, PNG, WebP or GIF images can be uploaded',
    );
  });

  it('rejects SVG images', async () => {
    await postCar()
      .attach('photoPath', Buffer.from('<svg/>'), {
        filename: 'a.svg',
        contentType: 'image/svg+xml',
      })
      .expect(400);
  });

  it('rejects files over the size limit', async () => {
    await postCar()
      .attach('photoPath', Buffer.alloc(MAX_UPLOAD_BYTES + 1), {
        filename: 'big.png',
        contentType: 'image/png',
      })
      .expect(413);
  });
});
