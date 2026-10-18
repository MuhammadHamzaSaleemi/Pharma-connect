import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

interface HttpExceptionResponseBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

// Races the services' own checks can't rule out (two requests claiming the same email/slug, a record
// deleted between lookup and update) surface as Prisma errors; report them as what they are, not 500.
function mapPrismaError(exception: unknown): { status: number; message: string } | null {
  if (!(exception instanceof Prisma.PrismaClientKnownRequestError)) return null;
  if (exception.code === 'P2002') {
    const target = exception.meta?.['target'];
    const fields = Array.isArray(target) ? target.join(', ') : 'value';
    return { status: HttpStatus.CONFLICT, message: `A record with this ${fields} already exists` };
  }
  if (exception.code === 'P2025') {
    return { status: HttpStatus.NOT_FOUND, message: 'Record not found' };
  }
  return null;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const prismaError = mapPrismaError(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (prismaError?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);

    let message = prismaError?.message ?? 'Internal server error';
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

    // Client errors are expected traffic (bad input, expired tokens); only 5xx need a stack trace.
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} → ${status}: ${message}`);
    }

    response.status(status).json({
      success: false,
      message,
      errors,
    });
  }
}
