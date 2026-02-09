import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

/**
 * Factory function for app initialization
 * Runs before the app bootstraps to restore authentication state
 */
export function initializeAuth(): Promise<void> {
    const authService = inject(AuthService);
    return authService.initializeAuth();
}
