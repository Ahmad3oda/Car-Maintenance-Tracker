"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const paths_util_1 = require("./common/utils/paths.util");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const uploadDir = (0, paths_util_1.ensureUploadDir)();
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
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Car Maintenance Tracker')
        .setDescription('The Car Maintenance Tracker API description')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Car Maintenance API running on 0.0.0.0:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map