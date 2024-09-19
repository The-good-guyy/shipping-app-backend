import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth_service.controller';
import { AuthServiceService } from './auth_service.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from 'nestjs-pino';
// to integrate redis and cache-manager, now install `pnpm install cache-manager-redis-store@^2.0.0`
// Don't update cache manager , redis only compatible with cache-manager version 2.0.0
@Module({
  imports: [
    // CacheModule.register<RedisClientOptions>({
    //   isGlobal: true,
    //   store: redisStore,
    //   socket: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        './env/postgres.env',
        './env/jwt.env',
        './env/redis.env',
        './env/others.env',
      ],
    }),
    LoggerModule.forRoot(),
    DatabaseModule,
    RedisModule,
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
