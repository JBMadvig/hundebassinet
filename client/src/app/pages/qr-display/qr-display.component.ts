import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import QRCode from 'qrcode';
import { Subscription } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { QrAuthApiService } from '@services/qr-auth-api.service';
import { WebSocketService } from '@services/websocket.service';

@Component({
    selector: 'app-qr-display',
    imports: [ CommonModule, RouterLink ],
    templateUrl: './qr-display.component.html',
})
export class QrDisplayComponent implements OnInit, OnDestroy {
    private qrAuthApi = inject(QrAuthApiService);
    public authService = inject(AuthService);
    private wsService = inject(WebSocketService);

    public qrDataUrl = signal<string>('');
    public posLoggedIn = signal(false);
    public loading = signal(true);
    public error = signal<string | null>(null);

    private refreshInterval?: ReturnType<typeof setInterval>;
    private wsSubscription?: Subscription;

    ngOnInit() {
        this.generateQr();
        this.refreshInterval = setInterval(() => this.generateQr(), 9 * 60 * 1000); // 9 minutes

        // Check current POS login status on load
        this.qrAuthApi.posStatus().subscribe({
            next: (status) => this.posLoggedIn.set(status.loggedIn),
            error: () => {},
        });

        // Connect WebSocket and subscribe to user room
        this.wsService.connect();
        const userId = this.authService.currentUser()?.id;
        if (userId) {
            this.wsService.subscribe(`user:${userId}`);
        }

        this.wsSubscription = this.wsService.messages$.subscribe((msg) => {
            if (msg['type'] === 'pos-login') {
                this.posLoggedIn.set(true);
            }
            if (msg['type'] === 'pos-logout') {
                this.posLoggedIn.set(false);
                this.generateQr();
            }
        });
    }

    generateQr() {
        this.loading.set(true);
        this.error.set(null);

        this.qrAuthApi.generateQrToken().subscribe({
            next: (res) => {
                QRCode.toDataURL(res.qrToken, { width: 250, margin: 2 }).then((url) => {
                    this.qrDataUrl.set(url);
                    this.loading.set(false);
                });
            },
            error: (err) => {
                if (err.status === 401) {
                    this.authService.logout();
                } else {
                    this.error.set('Failed to generate QR code');
                    this.loading.set(false);
                }
            },
        });
    }

    ngOnDestroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.wsSubscription?.unsubscribe();
        this.wsService.disconnect();
    }
}
