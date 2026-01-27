import { Component, computed, signal } from '@angular/core';

import { mockUsers } from '../pos/testdata';
import { DialogComponent } from './../../shared/components/dialog/dialog.component';
import { User } from './../../shared/types/user.types';
@Component({
    selector: 'app-users',
    imports: [
        DialogComponent,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent {

    public users = signal<User[]>(mockUsers);

    public selectedUser = signal<User | null>(null);

    public showUserDialog = signal(false);

    public titleModal = computed(() => {
        const selectedUser = this.selectedUser();

        if (selectedUser) {
            return `Enter pincode for ${selectedUser.name}`;
        }
        return 'Enter pincode';
    });

}
