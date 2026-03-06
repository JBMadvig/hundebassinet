import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Html5Qrcode } from 'html5-qrcode';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { AuthService } from '@services/auth.service';
import { AuthApiService } from '@services/auth-api.service';
import { QrAuthApiService } from '@services/qr-auth-api.service';

@Component({
    selector: 'app-pos-login',
    imports: [
        ButtonComponent,
        CommonModule,
        DialogComponent,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './pos-login.component.html',
})
export class PosLoginComponent implements OnInit, OnDestroy {
    private qrAuthApi = inject(QrAuthApiService);
    private authApi = inject(AuthApiService);
    private authService = inject(AuthService);
    private formBuilder = inject(FormBuilder);

    private readerEl = viewChild<ElementRef>('qrReader');
    private scanner?: Html5Qrcode;
    private isProcessing = false;

    public scanning = signal(true);
    public error = signal<string | null>(null);
    public scannerReady = signal(false);

    // SudoAdmin bypass modal
    public showBypassModal = signal(false);
    public bypassForm = this.formBuilder.group({
        email: [ '', [ Validators.required, Validators.email ] ],
        password: [ '', Validators.required ],
    });
    public bypassLoading = signal(false);
    public bypassError = signal<string | null>(null);

    ngOnInit() {
        // Small delay to ensure the DOM element is ready
        setTimeout(() => this.startScanner(), 300);
    }

    private async startScanner() {
        const el = this.readerEl();
        if (!el) return;

        try {
            this.scanner = new Html5Qrcode(el.nativeElement.id);
            await this.scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => this.onScanSuccess(decodedText),
                () => {}, // Ignore scan failures (no QR in frame)
            );
            this.scannerReady.set(true);
        } catch {
            this.error.set('Could not access camera. Please allow camera access.');
        }
    }

    private onScanSuccess(qrToken: string) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        this.stopScanner();
        this.scanning.set(false);

        this.qrAuthApi.qrLogin(qrToken).subscribe({
            next: (response) => {
                this.authService.loginToPOS(response.user);
            },
            error: () => {
                this.error.set('Invalid or expired QR code. Try again.');
                this.isProcessing = false;
                // Restart scanner after a delay
                setTimeout(() => {
                    this.error.set(null);
                    this.scanning.set(true);
                    this.startScanner();
                }, 2000);
            },
        });
    }

    // SudoAdmin bypass
    public openBypassModal() {
        this.showBypassModal.set(true);
        this.bypassError.set(null);
        this.bypassForm.reset();
    }

    public bypassLogin() {
        if (this.bypassForm.invalid) {
            this.bypassError.set('Please fill in all fields');
            return;
        }

        this.bypassLoading.set(true);
        this.bypassError.set(null);

        const email = this.bypassForm.value.email!;
        const password = this.bypassForm.value.password!;

        this.authApi.login({ email, password }).subscribe({
            next: (response) => {
                if (response.user.role !== 'sudo-admin') {
                    this.bypassError.set('Only sudo-admin users can use this login');
                    this.bypassLoading.set(false);
                    return;
                }
                this.authService.loginToPOS(response.user);
                this.bypassLoading.set(false);
            },
            error: () => {
                this.bypassError.set('Invalid email or password');
                this.bypassLoading.set(false);
            },
        });
    }

    private stopScanner() {
        try {
            this.scanner?.stop().catch(() => {});
        } catch {
            // Scanner already stopped
        }
        this.scanner = undefined;
    }

    ngOnDestroy() {
        this.stopScanner();
    }
}
