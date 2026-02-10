import { Component, inject, resource } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { UsersApiService } from '@services/users-api.service';

@Component({
    selector: 'app-user',
    imports: [
        RouterModule,
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
})
export class UserComponent {
    private authService = inject(AuthService);
    private activatedRoute = inject(ActivatedRoute);
    private userApiService = inject(UsersApiService);

    public userResource = resource({
        defaultValue: null,
        loader: async () => {

            const userId = this.activatedRoute.snapshot.paramMap.get('userId');

            if (!userId) {
                return null;
            }

            const resp = await this.userApiService.fetchUserById(userId);
            return resp;
        },
    });

    public adminUser = this.authService.currentUser;
}


