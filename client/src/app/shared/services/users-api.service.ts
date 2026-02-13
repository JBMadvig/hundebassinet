import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UpdateUserDetailsRequest, UpdateUserDetailsResponse, User } from '../types/user.types';
import { mapUser } from '../utils/map-user';

@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users`;

    // Fetch simple user data for login screen (no auth required)
    public fetchUsers(): Promise<User[]> {
        return firstValueFrom(
            this.http.get<User[]>(this.apiUrl).pipe(
                map((users) => users.map(mapUser)),
            ),
        );
    }

    // Fetch single user by ID, used to fetch other users' profiles
    public fetchUserById(id: string): Promise<User> {
        return firstValueFrom(
            this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
                map(mapUser),
            ),
        );
    }
    // Fetch all users with more details for admin panel (requires admin role) but exclude users with role "sudo-admin"
    public adminFetchUsers(): Promise<User[]> {
        return firstValueFrom(
            this.http.get<User[]>(`${this.apiUrl}/admin-data`).pipe(
                map((users) => users.map(mapUser)),
            ),
        );
    }

    // Fetch all users with more details for sudo-admin panel (requires sudo-admin role)
    public sudoAdminFetchUsers(): Promise<User[]> {
        return firstValueFrom(
            this.http.get<User[]>(`${this.apiUrl}/sudo-admin-data`).pipe(
                map((users) => users.map(mapUser)),
            ),
        );
    }

    // Update user details (name, email, role, balance)
    public updateUserDetails(userId: string, data: UpdateUserDetailsRequest): Promise<UpdateUserDetailsResponse> {
        return firstValueFrom(
            this.http.post<UpdateUserDetailsResponse>(`${this.apiUrl}/${userId}`, data).pipe(
                map((res) => ({ ...res, user: mapUser(res.user) })),
            ),
        );
    }

    // Upload avatar image for a user
    public uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return firstValueFrom(
            this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/${userId}/avatar`, formData),
        );
    }
}
