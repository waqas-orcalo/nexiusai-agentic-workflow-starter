import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

/**
 * Global response interceptor.
 * Wraps every successful response in the standard envelope:
 *
 * {
 *   success: true,
 *   message: string,
 *   data: <payload>,
 *   meta?: <pagination meta>
 * }
 *
 * Services should return objects of this shape directly.
 * If they already include success/message/data, this interceptor passes them through unchanged.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If service already returned a shaped response, pass it through
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data;
        }

        // Wrap bare data
        return {
          success: true,
          message: 'Request completed successfully.',
          data,
        };
      }),
    );
  }
}
