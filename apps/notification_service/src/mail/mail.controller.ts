import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from 'apps/notification_service/src/mail/user.entity';
@Controller()
export class MailController {
  constructor(private mailService: MailService) {}
  generateToken(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  @MessagePattern('send-confirmation-email')
  async sendUserConfirmation(@Payload() data: any) {
    const { email, name } = data;

    try {
      const token = this.generateToken();
      const user: User = { email, name };
      await this.mailService.sendUserConfirmation(user, token);
      return { message: 'Confirmation email sent successfully' };
    } catch (error) {
      return {
        message: 'Failed to send confirmation email',
        error: error.message,
      };
    }
  }
  @MessagePattern('send-password-reset-email')
  async handleSendPasswordResetEmail(@Payload() data: any) {
    try {
      await this.mailService.sendPasswordResetEmail(data.email, data.otp);
      return { message: 'Confirmation email sent successfully' };
    } catch (error) {
      return {
        message: 'Failed to send confirmation email',
        error: error.message,
      };
    }
  }
}
