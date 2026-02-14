import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

import { UserDetailsFormComponent } from '../components/user-details-form/user-details-form.component';

@Component({
    selector: 'app-me',
    imports: [
        UserDetailsFormComponent,
    ],
    templateUrl: './me.component.html',
    styleUrl: './me.component.css',
})
export class MeComponent implements OnInit {
    private authService = inject(AuthService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    public user = this.authService.currentUser;

    private readonly returnToMap: Record<string, { path: string; label: string }> = {
        '/users': { path: '/users', label: 'Go back to users dashboard' },
        '/pos':   { path: '/pos',   label: 'Go back to POS' },
    };

    public returnTo = signal(this.returnToMap['/pos']);

    public ngOnInit(): void {
        const returnToParam = this.activatedRoute.snapshot.queryParamMap.get('returnTo');
        if (returnToParam && this.returnToMap[returnToParam]) {
            this.returnTo.set(this.returnToMap[returnToParam]);
        }
    }

    public goBack() {
        this.router.navigate([ this.returnTo().path ]);
    }

}
