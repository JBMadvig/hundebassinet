import { Route } from '@angular/router';

import { adminGuard } from '@guards/admin.guard';

import { authGuard } from './shared/guards/auth.guard';
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
| '/users' | '/users/me' ;

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
                path: ':userId',
                canActivate: [ adminGuard ],
                loadComponent: () => import('./pages/users/user/user.component')
                    .then(m => m.UserComponent),
                data: {
                    id: 'user',
                },
            },
            {
                path: 'me',
                canActivate: [ authGuard ],
                loadComponent: () => import('./pages/users/user/user.component')
                    .then(m => m.UserComponent),
                data: {
                    id: 'me',
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
