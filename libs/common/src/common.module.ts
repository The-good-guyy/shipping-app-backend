import { Module } from '@nestjs/common';
import {
  RtStrategy,
  AtStrategy,
  AtCookieStrategy,
  RtCookieStrategy,
  ForgotPasswordStrategy,
  GoogleStrategy,
} from './strategies';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./env/jwt.env', './env/others.env', './env/gg.env'],
    }),
  ],
  providers: [
    AtStrategy,
    RtStrategy,
    AtCookieStrategy,
    RtCookieStrategy,
    ForgotPasswordStrategy,
    GoogleStrategy,
  ],
})
export class CommonModule {}
