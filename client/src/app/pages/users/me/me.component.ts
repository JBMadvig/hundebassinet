import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

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
export class MeComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    public user = this.authService.currentUser;

    public goBack() {
        this.router.navigate([ '/pos' ]);
    }

}
