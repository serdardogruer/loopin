import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Sunucu tarafında bir hata oluştu';

    if (exception?.name === 'ZodError' && Array.isArray(exception?.errors)) {
      status = HttpStatus.BAD_REQUEST;
      const issues = exception.errors.map((e: any) => e.message || 'Geçersiz veri');
      message = issues.join(', ');
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      message = typeof res === 'object' && res.message ? res.message : exception.message;
      if (Array.isArray(message)) {
        message = message.join(', ');
      }
    } else if (exception?.message) {
      message = exception.message;
    }

    console.error(`[API Error ${status}]:`, exception?.message || exception);

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
