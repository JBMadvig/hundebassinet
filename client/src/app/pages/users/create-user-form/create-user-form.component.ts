import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, model, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rolesList } from 'app/shared/types/auth.types';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { DropdownComponent } from '@components/input/dropdown/dropdown.component';
import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { emailValidator } from '@lib/input-validators/email.validator';
import { AuthService } from '@services/auth.service';
import { UsersApiService } from '@services/users-api.service';

enum CreateUserError {
    EMAIL_EXISTS= 'emailExists',
    SERVER_ERROR = 'serverError',
    FORBIDDEN_ROLE = 'forbiddenRole',
}
@Component({
    selector: 'app-create-user-form',
    imports: [
        ButtonComponent,
        CommonModule,
        DialogComponent,
        DropdownComponent,
        ReactiveFormsModule,
        InputFieldComponent,
    ],
    templateUrl: './create-user-form.component.html',
    styleUrl: './create-user-form.component.css',
})
export class CreateUserFormComponent {
    private authService = inject(AuthService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private usersApiService = inject(UsersApiService);

    public readonly createUserErrorOptions = CreateUserError;

    public readonly roleList = rolesList;
    public currentUser = this.authService.currentUser;

    public createUserForm = this.formBuilder.group({
        name: [ '', [ Validators.required, Validators.minLength(2) ] ],
        email: [ '', [ Validators.required, emailValidator() ] ],
        role: [ null, [ Validators.required ] ],
        balance: [ 0, [ Validators.required ] ],
        newPassword: [ '', [ Validators.required, Validators.minLength(8) ] ],
        confirmNewPassword: [ '', [ Validators.required, Validators.minLength(8) ] ],
    });

    public visible = model(false);

    public userCreated = output<void>();

    public passwordSignal = toSignal(this.createUserForm.controls.newPassword.valueChanges);
    public confirmPasswordSignal = toSignal(this.createUserForm.controls.confirmNewPassword.valueChanges);

    public passwordNotMatching = computed(() => {
        return this.createUserForm.value.newPassword !== this.createUserForm.value.confirmNewPassword;
    });

    public createUserError = signal<CreateUserError | null>(null);

    public roleListComputedValue = computed(() => {
        const currentUserRole = this.currentUser();
        // If current user is only admin, they are not allowed to make users a sudo-admin
        if(currentUserRole?.role === 'admin') {
            return this.roleList.filter(role => role.value !== 'sudo-admin');
        }

        return this.roleList;
    });

    public async createUser() {
        if (this.passwordNotMatching() || !this.createUserForm.valid) {
            return;
        }

        this.createUserError.set(null);
        const form = this.createUserForm.value;

        try {
            const response = await this.usersApiService.createUser({
                name: form.name ?? '',
                email: form.email ?? '',
                password: form.newPassword ?? '',
                role: form.role ?? 'user',
                balance: form.balance ?? 0,
            });

            this.visible.set(false);
            this.router.navigate([ '/users', response.user.id ]);
        } catch (error: unknown) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 409) {
                    this.createUserError.set(this.createUserErrorOptions.EMAIL_EXISTS);
                } else if (error.status === 403) {
                    this.createUserError.set(this.createUserErrorOptions.FORBIDDEN_ROLE);
                }
            } else {
                this.createUserError.set(this.createUserErrorOptions.SERVER_ERROR);
            }
        }
    }

}
