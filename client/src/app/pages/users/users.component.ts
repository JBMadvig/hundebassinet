import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { InputFieldComponent } from '@components/input-field/input-field.component';

import { mockUsers } from '../pos/testdata';
import { User } from './../../shared/types/user.types';
@Component({
    selector: 'app-users',
    imports: [
        ButtonComponent,
        CommonModule,
        DialogComponent,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent {

    public formBuilder = inject(FormBuilder);

    public passwordForm = this.formBuilder.group({
        password: '',
    });

    public users = signal<User[]>(mockUsers);
    public selectedUser = signal<User | null>(null);
    public showUserDialog = signal(false);

    public titleModal = computed(() => {
        const selectedUser = this.selectedUser();

        if (selectedUser) {
            return `Enter password for ${selectedUser.name}`;
        }
        return 'Enter password';
    });

    public userChosen(user: User) {
        this.selectedUser.set(user);
        this.showUserDialog.set(true);

    }

    public logIn() {
        console.log('Logging in user:', this.selectedUser()?.name, ', with password: ', this.passwordForm.value.password);
    }
}
