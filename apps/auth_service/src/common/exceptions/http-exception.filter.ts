import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

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
      'An error occurred';
    response.status(status).json({
      message: message,
      error: error,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
