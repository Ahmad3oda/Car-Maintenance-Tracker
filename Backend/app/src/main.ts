import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { ensureUploadDir } from './common/utils/paths.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApp(app);

  // Photos are not served statically: GET /uploads/... (PhotosController)
  // requires login and returns only the user's own photos.
  ensureUploadDir();

  const frontendOrigins = process.env.FRONTEND_URL?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: frontendOrigins?.length ? frontendOrigins : true,
  });

  const config = new DocumentBuilder()
    .setTitle('Car Maintenance Tracker')
    .setDescription('The Car Maintenance Tracker API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Token from POST /auth/login or /auth/register',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Car Maintenance API running on 0.0.0.0:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api`);
}

void bootstrap();
