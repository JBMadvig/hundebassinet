import { Route } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';
import { posRedirectGuard } from './shared/guards/pos-redirect.guard';

export interface RouteData {
    id: string;
}

interface CustomRoute extends Route {
    data?: RouteData;
    children?: CustomRoute[];
}

export const routes: CustomRoute[] = [
    {
        path: 'landing',
        pathMatch: 'full',
        loadComponent: () => import('./pages/users/users.component')
            .then(m => m.UsersComponent),
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
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'users',
    },
];
