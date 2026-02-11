import { Component, inject } from '@angular/core';

import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-me',
    imports: [],
    templateUrl: './me.component.html',
    styleUrl: './me.component.css',
})
export class MeComponent {
    private authService = inject(AuthService);

    public user = this.authService.currentUser();

}
