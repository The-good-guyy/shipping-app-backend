import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
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

  validate(payload: any) {
    return payload;
  }
}
