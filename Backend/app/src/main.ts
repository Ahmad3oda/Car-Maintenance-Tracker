import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { ensureUploadDir } from './common/utils/paths.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  // Railway (and most hosts) put one proxy in front of the app; trust it so
  // the login rate limit sees each client's real IP, not the proxy's.
  app.set('trust proxy', 1);

  // Security headers. The API serves JSON (CSP adds nothing and would break
  // the Swagger UI); photos set their own CSP in PhotosController.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  configureApp(app);

  // Photos are not served statically: GET /uploads/... (PhotosController)
  // requires login and returns only the user's own photos.
  ensureUploadDir();

  const frontendOrigins = process.env.FRONTEND_URL?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!frontendOrigins?.length && isProduction) {
    logger.warn(
      'FRONTEND_URL is not set: CORS allows every origin. Set it to your frontend URL.',
    );
  }
  app.enableCors({
    origin: frontendOrigins?.length ? frontendOrigins : true,
  });

  // Swagger is on locally; in production only when SWAGGER_ENABLED=true.
  const swaggerEnabled =
    !isProduction || process.env.SWAGGER_ENABLED === 'true';
  if (swaggerEnabled) {
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
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Car Maintenance API running on 0.0.0.0:${port}`);
  if (swaggerEnabled) {
    logger.log(`Swagger docs at http://localhost:${port}/api`);
  }
}

void bootstrap();
