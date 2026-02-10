import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Admin Guard - Protects routes that require admin/sudo-admin access
 * Redirects to users page if user is not an admin
 */
export const adminGuard: CanActivateFn = (_route, _state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdmin()) {
        return true;
    }

    // Redirect to users page - user doesn't have admin access
    router.navigate([ '/landing' ]);
    return false;
};
