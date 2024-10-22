import { Module } from '@nestjs/common';
import {
  RtStrategy,
  AtStrategy,
  AtCookieStrategy,
  RtCookieStrategy,
  ForgotPasswordStrategy,
  GoogleStrategy,
} from './strategies';
@Module({
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
