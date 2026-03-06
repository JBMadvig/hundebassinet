import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const deviceGuard: CanActivateFn = () => {
    const router = inject(Router);
    const deviceActivated = localStorage.getItem('deviceActivated');

    if (deviceActivated) {
        return true;
    }

    router.navigate([ '/device-activate' ]);
    return false;
};
