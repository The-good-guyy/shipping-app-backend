import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ForgotPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-forgot-password',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.params.token;
        },
      ]),
      secretOrKey: config.get<string>('FORGOT_PASSWORD_SECRET'),
    });
  }

  validate(req: Request, payload: any) {
    const token = req.params.token;

    if (!token) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      token,
    };
  }
}
