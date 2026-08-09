import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong';

      if (error.error?.message) {
        if (Array.isArray(error.error.message)) {
          message = error.error.message.join(', ');
        } else if (typeof error.error.message === 'string') {
          message = error.error.message;
        }
      } else if (typeof error.error === 'string' && error.error.length < 200) {
        message = error.error;
      } else if (error.statusText) {
        message = error.statusText;
      }

      notifications.showError(message);
      return throwError(() => error);
    }),
  );
};