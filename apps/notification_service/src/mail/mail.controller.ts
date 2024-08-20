import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class MailController {
  constructor(private mailService: MailService) {}

  @MessagePattern('send-confirmation-email')
  async sendUserConfirmation(@Payload() data: any) {
    const { email, name } = data;

    try {
      await this.mailService.sendUserConfirmation(email, name);
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
