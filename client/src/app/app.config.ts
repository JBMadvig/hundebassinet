import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { InternalErrorHandler } from '@services/internal-error-handlet.service';

import { initializeAuth } from './shared/initializers/auth.initializer';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: ErrorHandler, useClass: InternalErrorHandler },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withViewTransitions()),
        provideHttpClient(withInterceptors([ authInterceptor ])),
        provideAppInitializer(initializeAuth),
    ],
};
