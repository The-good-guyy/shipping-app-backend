import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api_gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);
  app.enableCors({ credentials: true });
  app.use((req, _, next) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    next();
  });
  app.use(
    '/api/v1/auth-api',
    createProxyMiddleware({
      target: configService.get('AUTH_SERVICE_URL'),
      changeOrigin: true,
    }),
  );
  app.use(
    '/api/v1/route-api',
    createProxyMiddleware({
      target: configService.get('ROUTE_SERVICE_URL'),
      changeOrigin: true,
    }),
  );
  //http
  await app.listen(3000);
}
bootstrap();
