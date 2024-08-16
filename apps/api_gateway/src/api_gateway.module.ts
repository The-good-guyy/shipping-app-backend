import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api_gateway.controller';
import { ApiGatewayService } from './api_gateway.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env/.env',
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
