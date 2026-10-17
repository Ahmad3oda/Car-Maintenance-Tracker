import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { alertsRefreshInterceptor } from './core/interceptors/alerts-refresh.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Native View Transitions: CSS-only page fades (styles.css).
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([
        apiInterceptor,    // runs first (outgoing)
        authInterceptor,   // adds the token once the URL is absolute
        alertsRefreshInterceptor, // reloads the bell after data changes
        errorInterceptor,  // runs on errors (incoming)
      ])
    ),
  ],
};