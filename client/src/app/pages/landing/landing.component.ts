import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, resource, signal  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from 'app/shared/types/user.types';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { InputFieldComponent } from '@components/input-field/input-field.component';
import { AuthService } from '@services/auth.service';
import { UsersApiService } from '@services/users-api.service';

@Component({
    selector: 'app-landing',
    imports: [
        ButtonComponent,
        CommonModule,
        DialogComponent,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
})
export class LandingComponent {
    public formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private usersApiService = inject(UsersApiService);

    @HostListener('document:keydown.enter', [ '$event' ])
    public onKeydownHandler(event: Event) {
        if (!(event instanceof KeyboardEvent)
            || event.key !== 'Enter'
            || !this.enterPasswordDialog()
            || !this.passwordForm.controls.password.value
        ) return;
        this.logIn();
    }

    public passwordForm = this.formBuilder.group({
        password: [ '', Validators.required ],
    });

    public usersResource = resource({
        loader: () => this.usersApiService.fetchUsers(),
    });
    public selectedUser = signal<User | null>(null);
    public enterPasswordDialog = signal(false);
    public loginLoader = signal(false);
    public loginError = signal<string | null>(null);

    public titleModal = computed(() => {
        const selectedUser = this.selectedUser();

        if (selectedUser) {
            return `Enter password for ${selectedUser.name}`;
        }
        return 'Enter password';
    });

    public userChosen(user: User) {
        this.selectedUser.set(user);
        this.enterPasswordDialog.set(true);
        this.loginError.set(null);
        this.passwordForm.reset();
    }

    public logIn() {
        this.loginLoader.set(true);
        const user = this.selectedUser();
        const password = this.passwordForm.value.password;

        if (!user || !password) {
            this.loginError.set('Please enter a password');
            return;
        }

        this.authService.login({
            email: user.email,
            password: password,
        }).subscribe({
            next: () => {
                this.enterPasswordDialog.set(false);
                this.passwordForm.reset();
                this.loginLoader.set(false);
            },
            error: (_error) => {
                this.loginError.set('Invalid email or password');
                this.loginLoader.set(false);
            },
        });
    }
}
