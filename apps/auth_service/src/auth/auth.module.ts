import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RtStrategy, AtStrategy } from './strategies';
import { UserModule } from '../users/users.module';
import { RedisModule } from '../redis/redis.module';
import { RoleModule } from '../role/role.module';
@Module({
  imports: [JwtModule.register({}), UserModule, RedisModule, RoleModule],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
