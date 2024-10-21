import { AuthGuard } from '@nestjs/passport';

export class ForgotPasswordGuard extends AuthGuard('jwt-forgot-password') {
  constructor() {
    super();
  }
}
