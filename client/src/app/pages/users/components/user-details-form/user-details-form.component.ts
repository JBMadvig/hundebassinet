import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rolesList } from 'app/shared/types/auth.types';
import { ChangePasswordRequest, UpdateUserDetailsRequest, User } from 'app/shared/types/user.types';

import { ButtonComponent } from '@components/button/button.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { EditableInputFieldComponent } from '@components/editable-input-field/editable-input-field.component';
import { InputFieldComponent } from '@components/input-field/input-field.component';
import { emailValidator } from '@lib/input-validators/email.validator';
import { AuthService } from '@services/auth.service';
import { ErrorService } from '@services/error.service';
import { UsersApiService } from '@services/users-api.service';

@Component({
    selector: 'app-user-details-form',
    imports: [
        ButtonComponent,
        CheckboxComponent,
        CommonModule,
        DropdownComponent,
        EditableInputFieldComponent,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './user-details-form.component.html',
    styleUrl: './user-details-form.component.css',
})
export class UserDetailsFormComponent implements OnInit {
    private authService = inject(AuthService);
    private destroyRef = inject(DestroyRef);
    private errorService = inject(ErrorService);
    private formBuilder = inject(FormBuilder);
    private usersApiService = inject(UsersApiService);

    public roleList = rolesList;

    public userDetailsForm = this.formBuilder.group({
        name: [ '', [ Validators.required, Validators.minLength(2) ] ],
        email: [ '', [ Validators.required, emailValidator() ] ],
        role: [ '' ],
        balance: 0,
    });
    public passwordForm = this.formBuilder.group({
        currentPassword: [ '', [ Validators.required ] ],
        overwriteCurrentPassword: [ false ],
        newPassword: [ '', [ Validators.required, Validators.minLength(8) ] ],
        confirmNewPassword: [ '', [ Validators.required, Validators.minLength(8) ] ],
    });

    public user = input.required<User>();
    public currentUser = this.authService.currentUser;
    public avatarUploaded = output<void>();
    public userUpdated = output<void>();

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
    public overwriteCurrentPasswordSignal = toSignal(
        this.passwordForm.controls.overwriteCurrentPassword.valueChanges,
    );

    public showUpdateSuccess = signal(false);
    public changePasswordSignal = signal(false);
    public changePasswordLoading = signal(false);
    public changePasswordSuccess = signal(false);
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
            const _currentPassword = this.currentPasswordSignal();
            const _newPassword = this.newPasswordSignal();
            const _confirmNewPassword = this.confirmNewPasswordSignal();

            this.changePasswordSignalError.set(null);
        });

        effect(() => {
            const overwrite = this.overwriteCurrentPasswordSignal();
            const currentPasswordControl = this.passwordForm.controls.currentPassword;

            if (overwrite) {
                currentPasswordControl.disable();
            } else {
                currentPasswordControl.enable();
            }
        });
    }

    public async saveUserDetails() {
        if (!this.userDetailsForm.valid) return;

        const form = this.userDetailsForm.controls;
        const user = this.user();

        // Build partial payload with only changed fields
        const payload: UpdateUserDetailsRequest = {};

        if (form.name.value !== user.name) {
            payload.name = form.name.value ?? user.name;
        }
        if (form.email.value !== user.email) {
            payload.email = form.email.value ?? user.email;
        }
        if (form.role.value !== user.role) {
            payload.role = form.role.value ?? user.role;
        }
        if (form.balance.value !== user.balance) {
            payload.balance = form.balance.value ?? user.balance;
        }

        if (Object.keys(payload).length === 0) return;

        try {
            const response = await this.usersApiService.updateUserDetails(user.id, payload);

            // If new tokens were returned (self-edit of email/role), update auth state
            if (response.accessToken && response.refreshToken) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                this.authService.currentUser.set(response.user);
            }

            this.userUpdated.emit();
            this.showUpdateSuccess.set(true);
            const timeoutId = setTimeout(() => this.showUpdateSuccess.set(false), 4000);
            this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
        } catch (error) {
            this.errorService.handleError(error, 'Update user details');
        }
    }

    public async changePassword() {
        const form = this.passwordForm.controls;

        const bypassCurrentPassword = form.overwriteCurrentPassword.value ?? false;
        const newPassword = form.newPassword.value;
        const confirmNewPassword = form.confirmNewPassword.value;

        if (newPassword !== confirmNewPassword) {
            this.changePasswordSignalError.set('noMatch');
            return;
        }

        const payload: ChangePasswordRequest = {
            newPassword: newPassword ?? '',
            bypassCurrentPassword,
        };

        if (!bypassCurrentPassword) {
            payload.currentPassword = form.currentPassword.value ?? '';
        }

        this.changePasswordLoading.set(true);

        try {
            const response = await this.usersApiService.changePassword(this.user().id, payload);

            // If self-edit, update tokens so the user stays logged in
            if (response.accessToken && response.refreshToken) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            this.passwordForm.reset();
            this.changePasswordSuccess.set(true);
            const timeoutId = setTimeout(() => {
                this.changePasswordSuccess.set(false);
                this.changePasswordSignal.set(false);
            }, 4000);
            this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
        } catch (error: unknown) {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                this.errorService.handleError(error, 'Incorrect current password');
                this.changePasswordSignalError.set('incorrectCurrent');
            } else {
                this.errorService.handleError(error, 'Password change server error');
                this.changePasswordSignalError.set('errorFromServer');
            }
        } finally {
            this.changePasswordLoading.set(false);
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
