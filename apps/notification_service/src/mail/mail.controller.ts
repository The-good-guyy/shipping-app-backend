import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { EventPattern, Payload } from '@nestjs/microservices';
@Controller()
export class MailController {
  constructor(private mailService: MailService) {}

  @EventPattern('send-confirmation-email')
  async sendUserConfirmation(@Payload() data: any) {
    // const user = {
    //   email: 'lapduy111201@gmail.com',
    //   name: 'Lap',
    // };

    const { email, name } = data;
    // const token = Math.floor(1000 + Math.random() * 9000).toString();

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
  @EventPattern('send-password-reset-email')
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
