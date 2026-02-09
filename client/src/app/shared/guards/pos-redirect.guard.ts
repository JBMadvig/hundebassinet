import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * POS Redirect Guard - Handles navigation to /pos without a userId
 * Redirects to /pos/:userId using the authenticated user's ID,
 * or to /users if not authenticated (fallback, authGuard should catch first)
 */
export const posRedirectGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.currentUser();

    if (currentUser) {
        return router.createUrlTree([ '/pos', currentUser.id ]);
    }

    return router.createUrlTree([ '/users' ]);
};
