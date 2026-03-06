import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest } from '../types/auth.types';
import { User } from '../types/user.types';
import { AuthApiService } from './auth-api.service';
import { CurrencyService } from './currency.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private authApi = inject(AuthApiService);
    private http = inject(HttpClient);
    private currencyService = inject(CurrencyService);
    private router = inject(Router);

    // Signals for state management
    public currentUser = signal<User | null>(null);
    public isAuthenticated = computed(() => this.currentUser() !== null);
    public isAdmin = computed(() => {
        const user = this.currentUser();
        return user?.role === 'admin' || user?.role === 'sudo-admin';
    });

    // Currency info for current user, used in various places to display currency correctly
    public currencyInfo = computed(() => {
        const code = this.currentUser()?.currency ?? 'DKK';
        return this.currencyService.getLocaleFromCurrency(code);
    });

    /**
     * Initialize authentication state on app startup
     * Tries to fetch current user using existing cookie
     */
    public initializeAuth(): Promise<void> {
        return new Promise((resolve) => {
            this.authApi
                .me()
                .pipe(
                    tap((user) => {
                        this.currentUser.set(user);
                    }),
                    catchError(() => {
                        // Cookie invalid or missing, try refresh
                        return this.attemptRefreshInternal();
                    }),
                )
                .subscribe({
                    complete: () => resolve(),
                    error: () => resolve(),
                });
        });
    }

    /**
     * Login with email and password
     */
    public login(credentials: LoginRequest) {
        return this.authApi.login(credentials).pipe(
            tap((response) => {
                this.currentUser.set(response.user);
                this.router.navigate([ '/qr-display' ]);
            }),
        );
    }

    /**
     * Login directly to POS (sudoAdmin bypass or QR scan result)
     */
    public loginToPOS(user: User): void {
        this.currentUser.set(user);
        this.router.navigate([ '/pos', user.id ]);
    }

    /**
     * Logout and clear authentication state
     */
    public logout(): void {
        // Server clears HttpOnly cookies
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe();
        this.currentUser.set(null);

        // If on an activated device, go to POS login scanner instead of landing
        if (localStorage.getItem('deviceActivated')) {
            this.router.navigate([ '/poslogin' ]);
        } else {
            this.router.navigate([ '/landing' ]);
        }
    }

    /**
     * POS-specific logout: clears user session but keeps device token
     */
    public posLogout(): void {
        const userId = this.currentUser()?.id;
        if (userId) {
            // Server clears auth cookies + notifies phone via WebSocket
            this.http.post(
                `${environment.apiUrl}/auth/pos-logout`,
                { userId },
                { withCredentials: true },
            ).subscribe();
        }
        this.currentUser.set(null);
        this.router.navigate([ '/poslogin' ]);
    }

    /**
     * Attempt to refresh the access token
     */
    public attemptRefresh(): void {
        this.attemptRefreshInternal().subscribe({
            error: () => {
                this.logout();
            },
        });
    }

    /**
     * Internal method to attempt token refresh
     */
    private attemptRefreshInternal() {
        return this.authApi.refresh().pipe(
            tap((response) => {
                this.currentUser.set(response.user);
            }),
            catchError(() => {
                this.currentUser.set(null);
                return of(null);
            }),
        );
    }
}
