import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { LoginRequest, RegisterRequest } from '../types/auth.types';
import { User } from '../types/user.types';
import { AuthApiService } from './auth-api.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private authApi = inject(AuthApiService);
    private router = inject(Router);

    // Signals for state management
    public currentUser = signal<User | null>(null);
    public isAuthenticated = computed(() => this.currentUser() !== null);
    public isAdmin = computed(() => {
        const user = this.currentUser();
        return user?.role === 'admin' || user?.role === 'sudo-admin';
    });

    /**
     * Initialize authentication state on app startup
     * Called by the app initializer
     */
    public initializeAuth(): Promise<void> {
        return new Promise((resolve) => {
            const accessToken = this.getAccessToken();

            if (!accessToken) {
                resolve();
                return;
            }

            // Attempt to fetch current user
            this.authApi
                .me()
                .pipe(
                    tap((user) => {
                        this.currentUser.set(user);
                    }),
                    catchError(() => {
                        // Token invalid, try refresh
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
                this.handleAuthSuccess(response.accessToken, response.refreshToken, response.user);
                this.router.navigate([ '/pos', response.user.id ]);
            }),
        );
    }

    /**
     * Register a new user
     */
    public register(data: RegisterRequest): void {
        this.authApi.register(data).subscribe({
            next: (response) => {
                this.handleAuthSuccess(response.accessToken, response.refreshToken, response.user);
                this.router.navigate([ '/pos', response.user.id ]);
            },
            error: (error) => {
                console.error('Registration failed:', error);
                throw error;
            },
        });
    }

    /**
     * Logout and clear authentication state
     */
    public logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.currentUser.set(null);
        this.router.navigate([ '/users' ]);
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
     * Get the current access token from localStorage
     */
    public getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    /**
     * Get the current refresh token from localStorage
     */
    public getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    /**
     * Internal method to attempt token refresh
     */
    private attemptRefreshInternal() {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            return of(null);
        }

        return this.authApi.refresh().pipe(
            tap((response) => {
                this.handleAuthSuccess(response.accessToken, response.refreshToken, response.user);
            }),
            catchError(() => {
                this.logout();
                return of(null);
            }),
        );
    }

    /**
     * Handle successful authentication
     */
    private handleAuthSuccess(accessToken: string, refreshToken: string, user: User): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        this.currentUser.set(user);
    }
}
