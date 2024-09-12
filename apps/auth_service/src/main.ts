import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth_service.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  MicroserviceExceptionFilter,
  AllExceptionsFilter,
} from './common/exceptions';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new MicroserviceExceptionFilter(),
    new HttpExceptionFilter(),
  );
  // app.useLogger(app.get(Logger));
  await app.listen(3001);
}
bootstrap();
