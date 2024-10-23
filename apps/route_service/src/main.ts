import { NestFactory } from '@nestjs/core';
import { RouteServiceModule } from './route_service.module';
import cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create(RouteServiceModule);
  app.use(cookieParser());
  // app.enableCors({
  //   origin: 'http://localhost:2999',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  await app.listen(3002);
}
bootstrap();
