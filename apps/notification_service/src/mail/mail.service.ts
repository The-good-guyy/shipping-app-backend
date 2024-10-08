import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, url: string, ttl: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to SSMS App! Confirm your Email',
      template: './confirmation',
      context: {
        email,
        url,
        ttl,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  async sendResetPasswordEmail(email: string, otp: string, ttl: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        name: email,
        otp,
        ttl,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  // async sendForgotPasswordEmail(id: string, url: string, ttl: string) {
  //   await this.mailerService.sendMail({
  //     to: email,
  //     subject: 'Password Reset Request',
  //     template: './password-reset',
  //     context: {
  //       id,
  //       url
  //       ttl,
  //       currentYear: new Date().getFullYear(),
  //     },
  //   });
}
