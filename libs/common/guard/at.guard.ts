import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EErrorMessage } from 'libs/common/error';
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
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
export class AtCookieGuard extends AuthGuard('jwt-cookie') {
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
