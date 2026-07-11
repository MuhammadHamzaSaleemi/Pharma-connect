import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface HttpExceptionResponseBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    const errors: string[] = [];

    if (exception instanceof HttpException) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else {
        const typedBody = body as HttpExceptionResponseBody;
        if (Array.isArray(typedBody.message)) {
          message = 'Validation failed';
          errors.push(...typedBody.message);
        } else {
          message = typedBody.message ?? exception.message;
        }
      }
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      success: false,
      message,
      errors,
    });
  }
}
