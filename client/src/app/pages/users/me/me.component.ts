import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { AuthService } from '@services/auth.service';
import { UsersApiService } from '@services/users-api.service';

import { UserDetailsFormComponent } from '../components/user-details-form/user-details-form.component';

enum DeleteAccountErrorOptions {
    NOT_FOUND = 'notFound',
    FORBIDDEN = 'forbidden',
    SERVER_ERROR = 'serverError',
}

@Component({
    selector: 'app-me',
    imports: [
        ButtonComponent,
        DialogComponent,
        UserDetailsFormComponent,
    ],
    templateUrl: './me.component.html',
    styleUrl: './me.component.css',
})
export class MeComponent implements OnInit {
    private authService = inject(AuthService);
    private activatedRoute = inject(ActivatedRoute);
    private userApiService = inject(UsersApiService);
    private router = inject(Router);

    public user = this.authService.currentUser;
    public isAdmin = this.authService.isAdmin;

    public readonly deleteAccountErrorOptions = DeleteAccountErrorOptions;
    public showDeleteAccountDialog = signal(false);
    public deleteAccountError = signal<DeleteAccountErrorOptions | null>(null);
    public forbiddenMessage = signal<string>('');

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

    public async deleteAccount() {
        const userId = this.user()?.id;
        if (!userId) return;

        try {
            await this.userApiService.deleteUser(userId);
            this.authService.logout();
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 404) {
                    this.deleteAccountError.set(DeleteAccountErrorOptions.NOT_FOUND);
                } else if (error.status === 403) {
                    this.forbiddenMessage.set(error.message);
                    this.deleteAccountError.set(DeleteAccountErrorOptions.FORBIDDEN);
                }
            } else {
                this.deleteAccountError.set(DeleteAccountErrorOptions.SERVER_ERROR);
            }
        }
    }
}
