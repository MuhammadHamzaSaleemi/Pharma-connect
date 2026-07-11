import { Logger, ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = (await NestFactory.create(AppModule)) as INestApplication;
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

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

  app.enableCors({
    origin: configService.get<string>('corsOrigin')?.split(',') ?? '*',
    credentials: configService.get<boolean>('corsAllowCredentials') ?? true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PharmaConnect Admin API')
    .setDescription('Backend foundation for PharmaConnect admin services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port') ?? 3000;

  try {
    await app.listen(port);
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is busy. Falling back to an available port.`);
      await app.listen(0);
    } else {
      throw error;
    }
  }

  const address = app.getHttpServer().address();
  const portString =
    typeof address === 'object' && address !== null && 'port' in address
      ? String(address.port)
      : String(port);

  logger.log(`Server listening at http://localhost:${portString}/api/v1`);
  logger.log(`Swagger available at http://localhost:${portString}/docs`);
}

void bootstrap();
