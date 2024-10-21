import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { EErrorMessage } from 'libs/common/error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus() || 500;
    const error =
      exception.getResponse()?.['error'] ||
      exception.name ||
      'Internal Server Error';
    const message =
      exception.getResponse()?.['message'] ||
      exception.message ||
      'An unexpected error occurred. Please try again later.';
    if (status === 401 && message === EErrorMessage.TOKEN_INVALID) {
      response.clearCookie('access_token');
    }
    response.status(status).json({
      message: message,
      error: error,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
