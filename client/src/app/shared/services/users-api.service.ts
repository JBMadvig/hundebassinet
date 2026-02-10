import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../types/user.types';
import { mapUser } from '../utils/map-user';

@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/landing`;

    public fetchUsers(): Promise<User[]> {
        return firstValueFrom(
            this.http.get<User[]>(this.apiUrl).pipe(
                map((users) => users.map(mapUser)),
            ),
        );
    }
}
