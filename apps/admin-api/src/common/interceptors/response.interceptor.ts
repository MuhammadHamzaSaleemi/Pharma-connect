import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import type { PaginationMeta } from '../dto/pagination.dto';

interface WrappableResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: PaginationMeta | null;
}

function isWrappableResponse<T>(value: unknown): value is WrappableResponse<T> {
  return typeof value === 'object' && value !== null && 'data' in value;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const customMessage = this.reflector.getAllAndOverride<string | undefined>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((response) => {
        if (isWrappableResponse<T>(response)) {
          return {
            success: true,
            message: customMessage ?? response.message ?? 'Operation completed successfully',
            data: response.data ?? null,
            meta: response.meta ?? null,
          };
        }

        return {
          success: true,
          message: customMessage ?? 'Operation completed successfully',
          data: response ?? null,
          meta: null,
        };
      }),
    );
  }
}
