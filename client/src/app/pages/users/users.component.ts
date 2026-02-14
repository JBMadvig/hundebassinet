import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from 'app/shared/types/user.types';

import { BadgeComponent } from '@components/badge/badge.component';
import { TableBodyData, TableComponent } from '@components/table/table.component';
import { TypedTemplateDirective } from '@directives/typed-template.directive';
import { AuthService } from '@services/auth.service';
import { ErrorService } from '@services/error.service';
import { UsersApiService } from '@services/users-api.service';
@Component({
    selector: 'app-users',
    imports: [
        CommonModule,
        BadgeComponent,
        RouterModule,
        TableComponent,
        TypedTemplateDirective,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
    private authService = inject(AuthService);
    private errorService = inject(ErrorService);
    private router = inject(Router);
    private usersApiService = inject(UsersApiService);

    public readonly typeToken!: TableBodyData<User>;

    public errorFetching = signal(false);
    public loading = signal(true);
    public users = signal<User[]>([]);

    public currentUser = this.authService.currentUser;

    public async ngOnInit(): Promise<void> {
        const currentUser = this.authService.currentUser();

        if(!currentUser) {
            return;
        }

        switch (currentUser.role) {
            case 'admin':
                try {
                    const adminUsers = await this.usersApiService.adminFetchUsers();
                    this.users.set(adminUsers);
                } catch (error) {
                    this.errorService.handleError(error, 'Error fetching users for admin');
                    console.error('Error fetching users for admin:', error);
                    this.errorFetching.set(true);
                } finally {
                    this.loading.set(false);
                }
                break;
            case 'sudo-admin':
                try {
                    const sudoAdminUsers = await this.usersApiService.sudoAdminFetchUsers();
                    this.users.set(sudoAdminUsers);
                } catch (error) {
                    this.errorService.handleError(error, 'Error fetching users for sudo-admin');
                    console.error('Error fetching users for sudo-admin:', error);
                    this.errorFetching.set(true);
                } finally {
                    this.loading.set(false);
                }
                break;
        }
    }

    public goBack() {
        this.router.navigate([ '/pos' ]);
    }
}
