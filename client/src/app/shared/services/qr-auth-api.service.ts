import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../types/auth.types';
import { mapUser } from '../utils/map-user';

export interface QrTokenResponse {
    qrToken: string;
    expiresAt: string;
}

export interface DeviceActivateResponse {
    deviceName: string;
}

@Injectable({ providedIn: 'root' })
export class QrAuthApiService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    generateQrToken(): Observable<QrTokenResponse> {
        return this.http.post<QrTokenResponse>(`${this.apiUrl}/qr-token`, {});
    }

    activateDevice(credentials: { email: string; password: string; deviceName?: string }): Observable<DeviceActivateResponse> {
        return this.http.post<DeviceActivateResponse>(`${this.apiUrl}/device-activate`, credentials);
    }

    qrLogin(qrToken: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.apiUrl}/qr-login`,
            { qrToken },
        ).pipe(
            map((res) => ({ ...res, user: mapUser(res.user) })),
        );
    }

    posLogout(userId: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(
            `${this.apiUrl}/pos-logout`,
            { userId },
        );
    }
}
