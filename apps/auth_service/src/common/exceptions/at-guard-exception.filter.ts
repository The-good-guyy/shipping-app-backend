import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AtGuardExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('AtGuardExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.clearCookie('access_token');
  }
}
