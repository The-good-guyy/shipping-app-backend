import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'apps/notification_service/src/mail/user.entity';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3001/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.name,
        url,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordResetEmail(user: User, otp: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        name: user.name,
        otp: otp,
        currentYear: new Date().getFullYear(),
      },
    });
  }
}
