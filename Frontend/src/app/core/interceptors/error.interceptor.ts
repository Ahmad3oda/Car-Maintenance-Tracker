import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = '';

      // 1. Connection / Network errors (status 0)
      if (error.status === 0) {
        message =
          'Unable to connect to the backend server. Please check your internet connection or verify the server is running.';
      }

      // 2. Parse backend-provided error message payloads
      if (!message && error.error) {
        if (Array.isArray(error.error.message)) {
          // NestJS class-validator errors array
          message = error.error.message
            .map((msg: string) => {
              if (typeof msg === 'string' && msg.length > 0) {
                return msg.charAt(0).toUpperCase() + msg.slice(1);
              }
              return msg;
            })
            .join('. ');
        } else if (typeof error.error.message === 'string' && error.error.message.trim()) {
          message = error.error.message;
        } else if (Array.isArray(error.error.errors)) {
          message = error.error.errors
            .map((e: any) => (typeof e === 'string' ? e : e?.message || JSON.stringify(e)))
            .join('. ');
        } else if (typeof error.error === 'string' && !error.error.startsWith('<!DOCTYPE') && error.error.length < 250) {
          message = error.error;
        }
      }

      // 3. Fallback based on HTTP status codes if no specific message was extracted
      if (!message) {
        switch (error.status) {
          case 400:
            message = 'Invalid request. Please check your entered information and try again.';
            break;
          case 401:
            message = 'You are not authorized to perform this action. Please log in.';
            break;
          case 403:
            message = 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            message = 'The requested vehicle, item, or maintenance record was not found.';
            break;
          case 409:
            message = 'A conflict occurred. A record with similar details already exists.';
            break;
          case 413:
            message = 'The uploaded file is too large. Please select a smaller image.';
            break;
          case 422:
            message = 'Unable to process the request due to invalid input data.';
            break;
          case 500:
            message = 'An unexpected internal server error occurred. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            message = 'The server is temporarily unavailable. Please try again in a few moments.';
            break;
          default:
            message = error.statusText || 'An unexpected error occurred. Please try again.';
            break;
        }
      }

      notifications.showError(message);
      return throwError(() => error);
    }),
  );
};