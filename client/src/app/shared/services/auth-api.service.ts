import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest } from '../types/auth.types';
import { User } from '../types/user.types';
import { mapUser } from '../utils/map-user';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            map((res) => ({ ...res, user: mapUser(res.user) })),
        );
    }

    refresh(): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
            map((res) => ({ ...res, user: mapUser(res.user) })),
        );
    }

    me(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/me`).pipe(
            map(mapUser),
        );
    }
}
