import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { QrAuthApiService } from '../services/qr-auth-api.service';

export const deviceGuard: CanActivateFn = () => {
    const router = inject(Router);
    const qrAuthApi = inject(QrAuthApiService);
    const deviceActivated = localStorage.getItem('deviceActivated');

    if (!deviceActivated) {
        router.navigate([ '/device-activate' ]);
        return false;
    }

    return qrAuthApi.posStatus().pipe(
        map(() => true),
        catchError(() => {
            localStorage.removeItem('deviceActivated');
            router.navigate([ '/device-activate' ]);
            return of(false);
        }),
    );

    // Same as:
    // try {
    //     await firstValueFrom(qrAuthApi.posStatus());
    //     return true;
    // } catch {
    //     localStorage.removeItem('deviceActivated');
    //     router.navigate([ '/device-activate' ]);
    //     return false;
    // }
};
