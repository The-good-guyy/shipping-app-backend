import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EErrorMessage } from '../constants';
@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}

@Injectable()
export class RtCookieGuard extends AuthGuard('jwt-refresh-cookie') {
  constructor() {
    super();
  }
  handleRequest(err, user) {
    if (err || !user) {
      console.log('RT COOKIE GUARD');
      throw new UnauthorizedException(EErrorMessage.TOKEN_INVALID);
    }
    return user;
  }
}
