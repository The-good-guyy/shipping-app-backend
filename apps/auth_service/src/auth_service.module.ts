import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth_service.controller';
import { AuthServiceService } from './auth_service.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
// to integrate redis and cache-manager, now install `pnpm install cache-manager-redis-store@^2.0.0`
// Don't update cache manager , redis only compatible with cache-manager version 2.0.0
@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./env/postgres.env', './env/jwt.env'],
    }),
    DatabaseModule,
    PermissionModule,
    // AuthModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
