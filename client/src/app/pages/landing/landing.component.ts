import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '@components/button/button.component';
import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-landing',
    imports: [
        ButtonComponent,
        CommonModule,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
})
export class LandingComponent {
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);

    @HostListener('document:keydown.enter', [ '$event' ])
    public onKeydownHandler(event: Event) {
        if (!(event instanceof KeyboardEvent) || event.key !== 'Enter') return;
        this.logIn();
    }

    public loginForm = this.formBuilder.group({
        email: [ '', [ Validators.required, Validators.email ] ],
        password: [ '', Validators.required ],
    });

    public loginLoader = signal(false);
    public loginError = signal<string | null>(null);

    public logIn() {
        if (this.loginForm.invalid) {
            this.loginError.set('Please fill in all fields');
            return;
        }

        this.loginLoader.set(true);
        this.loginError.set(null);

        const email = this.loginForm.value.email!;
        const password = this.loginForm.value.password!;

        this.authService.login({ email, password }).subscribe({
            next: () => {
                this.loginLoader.set(false);
            },
            error: () => {
                this.loginError.set('Invalid email or password');
                this.loginLoader.set(false);
            },
        });
    }
}
