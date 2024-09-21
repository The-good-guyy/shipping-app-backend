import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth_service.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  MicroserviceExceptionFilter,
  AllExceptionsFilter,
} from './common/exceptions';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
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
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../auth.proto'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
