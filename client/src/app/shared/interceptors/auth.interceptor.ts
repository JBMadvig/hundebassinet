import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor for authentication
 * - Sets withCredentials on all requests so cookies are sent
 * - Handles 401 errors by attempting to refresh the token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Clone request with withCredentials so cookies are sent/received
    const authReq = req.clone({ withCredentials: true });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expired or invalid - attempt refresh
                // Only if not already on auth endpoints to avoid infinite loop
                if (!req.url.includes('/auth/')) {
                    authService.attemptRefresh();
                }
            }
            return throwError(() => error);
        }),
    );
};
