import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EErrorMessage } from '../constants';
@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  handleRequest(err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw new UnauthorizedException(EErrorMessage.TOKEN_INVALID);
    }
    return user;
  }
}

@Injectable()
export class RtCookieGuard extends AuthGuard('jwt-refresh-cookie') {
  constructor() {
    super();
  }
  handleRequest(err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw new UnauthorizedException(EErrorMessage.TOKEN_INVALID);
    }
    return user;
  }
}
