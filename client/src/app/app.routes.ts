import { Route } from '@angular/router';

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
        loadComponent: () => import('./pages/landing/landing.component')
            .then(m => m.LandingComponent),
        data: {
            id: 'landing',
        },
    },
    {
        path: 'pos',
        pathMatch: 'full',
        loadComponent: () => import('./pages/pos/pos.component')
            .then(m => m.PosComponent),
        data: {
            id: 'pos',
        },
    },
    {
        path: '**',
        redirectTo: 'landing',
    },
];
