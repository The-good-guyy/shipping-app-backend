import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class MailController {
  constructor(private mailService: MailService) {}
  @MessagePattern('send-confirmation-email')
  async sendUserConfirmation(@Payload() emailData: any) {
    const { email, url, ttl } = emailData;

    try {
      await this.mailService.sendUserConfirmation(email, url, ttl);
      console.log('oke');
      return { message: 'Confirmation email sent successfully' };
    } catch (error) {
      return {
        message: 'Failed to send confirmation email',
        error: error.message,
      };
    }
  }
  @MessagePattern('send-forgot-password-email')
  async handleSendPasswordResetEmail(@Payload() data: any) {
    const { email, id, url, ttl } = data;
    console.log('okeforgot');
    try {
      await this.mailService.sendResetPasswordEmail(email, id, url, ttl);
      return { message: 'Confirmation email sent successfully' };
    } catch (error) {
      return {
        message: 'Failed to send confirmation email',
        error: error.message,
      };
    }
  }
}
// @MessagePattern('send-forgot-password-email')
// async handleSendForgotPasswordEmail(@Payload() data: any) {
//   const { id, url, ttl } = data;
//   try {
//     await this.mailService.sendForgotPasswordEmail(id, url, ttl);
//     return { message: 'Confirmation email sent successfully' };
//   } catch (error) {
//     return {
//       message: 'Failed to send confirmation email',
//       error: error.message,
//     };
//   }
// }
