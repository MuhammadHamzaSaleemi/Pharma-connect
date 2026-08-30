import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.useStaticAssets(configService.get<string>('uploadDir') ?? join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  const isProduction = configService.get<string>('environment') === 'production';

  app.enableCors({
    origin: configService
      .get<string>('corsOrigin', '*')
      .split(',')
      .map((origin) => origin.trim()),
    credentials: configService.get<boolean>('corsAllowCredentials') ?? false,
  });

  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PharmaConnect Admin API')
      .setDescription('Backend foundation for PharmaConnect admin services')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('port') ?? 3000;

  await app.listen(port, '127.0.0.1');

  logger.log(`Server listening at http://127.0.0.1:${port}/api/v1`);
  if (!isProduction) {
    logger.log(`Swagger available at http://127.0.0.1:${port}/docs`);
  }
}

void bootstrap();
