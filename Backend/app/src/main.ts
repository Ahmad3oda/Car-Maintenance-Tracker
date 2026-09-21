import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ensureUploadDir } from './common/utils/paths.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const uploadDir = ensureUploadDir();
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  const frontendOrigins = process.env.FRONTEND_URL
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: frontendOrigins?.length ? frontendOrigins : true,
  });

  const config = new DocumentBuilder()
    .setTitle('Car Maintenance Tracker')
    .setDescription('The Car Maintenance Tracker API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Car Maintenance API running on 0.0.0.0:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api`);
}

bootstrap();
