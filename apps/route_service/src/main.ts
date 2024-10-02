import { NestFactory } from '@nestjs/core';
import { RouteServiceModule } from './route_service.module';

async function bootstrap() {
  const app = await NestFactory.create(RouteServiceModule);
  await app.listen(3000);
}
bootstrap();
