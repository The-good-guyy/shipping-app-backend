import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
export class RtCookieGuard extends AuthGuard('jwt-refresh-cookie') {
  constructor() {
    super();
  }
}
