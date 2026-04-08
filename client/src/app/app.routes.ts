import { Route } from '@angular/router';

import { adminGuard } from '@guards/admin.guard';

import { authGuard } from './shared/guards/auth.guard';
import { deviceGuard } from './shared/guards/device.guard';
import { posRedirectGuard } from './shared/guards/pos-redirect.guard';

export interface RouteData {
    id: string;
}

interface CustomRoute extends Route {
    data?: RouteData;
    children?: CustomRoute[];
}

// Update possible routes for this type
export type RedirectPaths = '/landing'
| '/pos' | '/pos/inventory'
| '/users' | '/users/me'
| '/qr-display' | '/poslogin' | '/device-activate' | '/scan-item' ;

export const routes: CustomRoute[] = [
    {
        path: 'landing',
        pathMatch: 'full',
        loadComponent: () => import('./pages/landing/landing.component')
            .then(m => m.LandingComponent),
        data: {
            id: 'landing',
        },
    },
    {
        path: 'qr-display',
        canActivate: [ authGuard ],
        loadComponent: () => import('./pages/qr-display/qr-display.component')
            .then(m => m.QrDisplayComponent),
        data: {
            id: 'qr-display',
        },
    },
    {
        path: 'device-activate',
        loadComponent: () => import('./pages/device-activate/device-activate.component')
            .then(m => m.DeviceActivateComponent),
        data: {
            id: 'device-activate',
        },
    },
    {
        path: 'scan-item',
        canActivate: [ authGuard ],
        loadComponent: () => import('./pages/scan-item/scan-item.component')
            .then(m => m.ScanItemComponent),
        data: {
            id: 'scan-item',
        },
    },
    {
        path: 'poslogin',
        canActivate: [ deviceGuard ],
        loadComponent: () => import('./pages/pos-login/pos-login.component')
            .then(m => m.PosLoginComponent),
        data: {
            id: 'poslogin',
        },
    },
    {
        path: 'pos',
        canActivate: [ authGuard ],
        children: [
            {
                path: '',
                pathMatch: 'full',
                canActivate: [ posRedirectGuard ],
                children: [],
            },
            {
                path: 'inventory',
                canActivate: [ adminGuard ],
                loadComponent: () => import('./pages/inventory/inventory.component')
                    .then(m => m.InventoryComponent),
                data: {
                    id: 'inventory',
                },
            },
            {
                path: ':userId',
                loadComponent: () => import('./pages/pos/pos.component')
                    .then(m => m.PosComponent),
                data: {
                    id: 'pos',
                },
            },
        ],
    },
    {
        path: 'users',
        canActivate: [ authGuard ],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/users/users.component')
                    .then(m => m.UsersComponent),
                canActivate: [ adminGuard ],
                data: {
                    id: 'users',
                },
            },
            {
                path: 'me',
                canActivate: [ authGuard ],
                loadComponent: () => import('./pages/users/me/me.component')
                    .then(m => m.MeComponent),
                data: {
                    id: 'me',
                },
            },
            {
                path: ':userId',
                canActivate: [ adminGuard ],
                loadComponent: () => import('./pages/users/user/user.component')
                    .then(m => m.UserComponent),
                data: {
                    id: 'user',
                },
            },
        ],
    },
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'landing',
    },
];
