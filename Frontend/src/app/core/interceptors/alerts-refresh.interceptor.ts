import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AlertsRefreshService } from '../services/alerts-refresh.service';

/** API paths whose changes can move an item into or out of the due list. */
const WATCHED_PATHS = /\/(cars|items|maintenance-records)(\/|\?|$)/;

/**
 * After a successful create, update or delete of a car, item or record,
 * asks the header bell to reload. Requests and responses pass through untouched.
 */
export const alertsRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const alerts = inject(AlertsRefreshService);
  const changesData = req.method !== 'GET' && WATCHED_PATHS.test(req.url);

  return next(req).pipe(
    tap((event) => {
      if (changesData && event instanceof HttpResponse) {
        alerts.notifyChanged();
      }
    }),
  );
};
