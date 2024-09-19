import { AuthGuard } from '@nestjs/passport';

export class AtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
export class AtCookieGuard extends AuthGuard('jwt-cookie') {
  constructor() {
    super();
  }
}
