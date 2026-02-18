import { CommonModule } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from 'app/shared/types/user.types';

import { BadgeComponent } from '@components/badge/badge.component';
import { ButtonComponent } from '@components/button/button.component';
import { TableBodyData, TableComponent } from '@components/table/table.component';
import { TypedTemplateDirective } from '@directives/typed-template.directive';
import { AuthService } from '@services/auth.service';
import { UsersApiService } from '@services/users-api.service';

import { LocaleCurrencyPipe } from '../../shared/pipes/locale-currency.pipe';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
@Component({
    selector: 'app-users',
    imports: [
        BadgeComponent,
        ButtonComponent,
        CommonModule,
        RouterModule,
        TableComponent,
        TypedTemplateDirective,
        CreateUserFormComponent,
        LocaleCurrencyPipe,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private usersApiService = inject(UsersApiService);

    public readonly typeToken!: TableBodyData<User>;
    public currentUser = this.authService.currentUser;
    public currencyInfo = this.authService.currencyInfo;

    public usersResource = resource({
        defaultValue: [],
        loader: async () => {
            const currentUser = this.currentUser()?.role;

            if (!currentUser) {
                return [];
            }

            switch (currentUser) {
                case 'admin':
                    return await this.usersApiService.adminFetchUsers();
                case 'sudo-admin':
                    return await this.usersApiService.sudoAdminFetchUsers();
                default:
                    return [];
            }
        },
    });

    public errorFetching = signal(false);
    public loading = signal(true);
    public showCreateUserModal = signal(false);

    public goBack() {
        this.router.navigate([ '/pos' ]);
    }
}
