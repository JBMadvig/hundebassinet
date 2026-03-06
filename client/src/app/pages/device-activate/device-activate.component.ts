import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '@components/button/button.component';
import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { QrAuthApiService } from '@services/qr-auth-api.service';

@Component({
    selector: 'app-device-activate',
    imports: [
        ButtonComponent,
        CommonModule,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './device-activate.component.html',
})
export class DeviceActivateComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private qrAuthApi = inject(QrAuthApiService);
    private router = inject(Router);

    ngOnInit() {
        // If device is already activated, redirect to POS login
        if (localStorage.getItem('deviceActivated')) {
            this.router.navigate([ '/poslogin' ]);
        }
    }

    @HostListener('document:keydown.enter', [ '$event' ])
    public onKeydownHandler(event: Event) {
        if (!(event instanceof KeyboardEvent) || event.key !== 'Enter') return;
        this.activate();
    }

    public activateForm = this.formBuilder.group({
        email: [ '', [ Validators.required, Validators.email ] ],
        password: [ '', Validators.required ],
    });

    public loading = signal(false);
    public error = signal<string | null>(null);

    public activate() {
        if (this.activateForm.invalid) {
            this.error.set('Please fill in all fields');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        const email = this.activateForm.value.email!;
        const password = this.activateForm.value.password!;

        this.qrAuthApi.activateDevice({ email, password }).subscribe({
            next: () => {
                localStorage.setItem('deviceActivated', 'true');
                this.loading.set(false);
                this.router.navigate([ '/poslogin' ]);
            },
            error: (err) => {
                if (err.status === 403) {
                    this.error.set('Only sudo-admin users can activate devices');
                } else {
                    this.error.set('Invalid email or password');
                }
                this.loading.set(false);
            },
        });
    }
}
