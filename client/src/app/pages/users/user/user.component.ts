import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { AuthService } from '@services/auth.service';
import { UsersApiService } from '@services/users-api.service';

import { UserDetailsFormComponent } from '../components/user-details-form/user-details-form.component';

enum DeleteUserErrorOptions {
    NO_ID_MATCH = 'noIdMatch',
    SERVER_ERROR = 'serverError',
    FORBIDDEN_ROLE = 'forbiddenRole',
}

@Component({
    selector: 'app-user',
    imports: [
        ButtonComponent,
        CommonModule,
        DialogComponent,
        RouterModule,
        UserDetailsFormComponent,
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
})
export class UserComponent {
    private authService = inject(AuthService);
    private activatedRoute = inject(ActivatedRoute);
    private userApiService = inject(UsersApiService);
    private router = inject(Router);

    public readonly deleteUserErrorOptions = DeleteUserErrorOptions;
    public adminUser = this.authService.currentUser;

    public userResource = resource({
        defaultValue: null,
        loader: async () => {
            const userId = this.activatedRoute.snapshot.paramMap.get('userId')
                ?? this.authService.currentUser()?.id;

            if (!userId) {
                return null;
            }

            const resp = await this.userApiService.fetchUserById(userId);
            return resp;
        },
    });


    public showDeleteUserDialog = signal(false);
    public deleteUserError = signal<DeleteUserErrorOptions | null>(null);

    public goBack() {
        this.router.navigate([ '/users' ]);
    }

    public async deleteUser() {
        const userId = this.userResource.value()?.id;
        if(!userId) {
            return;
        }

        try {
            await this.userApiService.deleteUser(userId);
            this.router.navigate( [ '/users' ] );
        } catch(error) {
            if (error instanceof HttpErrorResponse) {
                if(error.status === 404) {
                    this.deleteUserError.set(this.deleteUserErrorOptions.NO_ID_MATCH);
                } else if (error.status === 403) {
                    this.deleteUserError.set(this.deleteUserErrorOptions.FORBIDDEN_ROLE);
                }
            } else {
                this.deleteUserError.set(this.deleteUserErrorOptions.SERVER_ERROR);

            }
        }

    }
}
