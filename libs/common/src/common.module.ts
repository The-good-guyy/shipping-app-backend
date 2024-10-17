import { Module } from '@nestjs/common';
import {
  RtStrategy,
  AtStrategy,
  AtCookieStrategy,
  RtCookieStrategy,
  ForgotPasswordStrategy,
} from './strategies';
@Module({
  providers: [
    AtStrategy,
    RtStrategy,
    AtCookieStrategy,
    RtCookieStrategy,
    ForgotPasswordStrategy,
  ],
})
export class CommonModule {}
