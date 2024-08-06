import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth_service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  await app.listen(3001);
}
bootstrap();
