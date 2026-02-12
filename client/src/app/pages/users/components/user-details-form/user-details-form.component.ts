import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { rolesList } from 'app/shared/types/auth.types';
import { User, UserWithPassword } from 'app/shared/types/user.types';

import { ButtonComponent } from '@components/button/button.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { EditableInputFieldComponent } from '@components/editable-input-field/editable-input-field.component';
import { InputFieldComponent } from '@components/input-field/input-field.component';
import { AuthService } from '@services/auth.service';
import { ErrorService } from '@services/error.service';
import { UsersApiService } from '@services/users-api.service';

@Component({
    selector: 'app-user-details-form',
    imports: [
        ButtonComponent,
        CommonModule,
        DropdownComponent,
        EditableInputFieldComponent,
        ReactiveFormsModule,
        InputFieldComponent,
    ],
    templateUrl: './user-details-form.component.html',
    styleUrl: './user-details-form.component.css',
})
export class UserDetailsFormComponent implements OnInit {
    private authService = inject(AuthService);
    private errorService = inject(ErrorService);
    private formBuilder = inject(FormBuilder);
    private usersApiService = inject(UsersApiService);

    public roleList = rolesList;

    public userDetailsForm = this.formBuilder.group({
        name: [ '' ],
        email: [ '' ],
        role: [ '' ],
        balance: 0,
    });
    public passwordForm = this.formBuilder.group({
        currentPassword: [ '' ],
        newPassword: [ '' ],
        confirmNewPassword: [ '' ],
    });

    public user = input.required<User>();
    public currentUser = this.authService.currentUser;
    public avatarUploaded = output<void>();

    public nameFormSignal = toSignal(this.userDetailsForm.controls.name.valueChanges);
    public emailFormSignal = toSignal(this.userDetailsForm.controls.email.valueChanges);
    public roleFormSignal = toSignal(this.userDetailsForm.controls.role.valueChanges);
    public balanceFormSignal = toSignal(this.userDetailsForm.controls.balance.valueChanges);

    public currentPasswordSignal = toSignal(
        this.passwordForm.controls.currentPassword.valueChanges,
    );
    public newPasswordSignal = toSignal(
        this.passwordForm.controls.newPassword.valueChanges,
    );
    public confirmNewPasswordSignal = toSignal(
        this.passwordForm.controls.confirmNewPassword.valueChanges,
    );

    public changePasswordSignal = signal(false);
    public changePasswordSignalError = signal<'noMatch' | 'incorrectCurrent' | 'errorFromServer' | null>(null);

    public changesHasBeenMade = computed(() => {
        const user = this.user();

        if(!user) return false;

        return this.nameFormSignal() !== user.name
        || this.emailFormSignal() !== user.email
        || this.roleFormSignal() !== user.role
        || this.balanceFormSignal() !== user.balance;
    });

    public roleListComputedValue = computed(() => {
        const currentUserRole = this.currentUser();
        // If current user is only admin, they are not allowed to make users a sudo-admin
        if(currentUserRole?.role === 'admin') {
            return this.roleList.filter(role => role.value !== 'sudo-admin');
        }

        return this.roleList;
    });

    public async ngOnInit(): Promise<void> {
        const form = this.userDetailsForm;

        // set the form values based on the input user
        form.setValue({
            name: this.user().name,
            email: this.user().email,
            role: this.user().role,
            balance: this.user().balance,
        });
    }

    constructor() {
        effect(() => {
            const currentPassword = this.currentPasswordSignal();
            const newPassword = this.newPasswordSignal();
            const confirmNewPassword = this.confirmNewPasswordSignal();

            this.changePasswordSignalError.set(null);
        });
    }

    public saveUserDetails() {

        if(this.userDetailsForm.valid) {
            const form = this.userDetailsForm.controls;

            const name = form.name.value;
            const email = form.email.value;
            const role = form.role.value;
            const balance = form.role.value;
        }
    }

    public changePassword() {
        if (this.passwordForm.valid) {
            const form = this.passwordForm.controls;

            const currentPassword = form.currentPassword.value;
            const newPassword = form.newPassword.value;
            const confirmNewPassword = form.confirmNewPassword.value;

            if (newPassword !== confirmNewPassword) {
                this.changePasswordSignalError.set('noMatch');
                return;
            }
        }
    }

    public async onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
            await this.usersApiService.uploadAvatar(this.user().id, file);
            this.avatarUploaded.emit();
        } catch (error) {
            this.errorService.handleError(error, 'Avatar upload');
        }
    }
}
