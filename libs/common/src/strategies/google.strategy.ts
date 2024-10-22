import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow('GG_CLIENT_ID'),
      clientSecret: config.getOrThrow('GG_SECRET_KEY'),
      callbackURL: 'http://localhost:3000/api/v1/auth-api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      username: name.givenName + ' ' + name.familyName,
      profileImage: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
