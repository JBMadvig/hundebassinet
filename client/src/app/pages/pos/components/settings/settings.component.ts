import { Component, inject, model } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { AuthService } from '@services/auth.service';

type RedirectPaths = 'inventory' | 'user-settings' | 'admin-settings';
@Component({
    selector: 'app-settings',
    imports: [
        ButtonComponent,
        DialogComponent,
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
})
export class SettingsComponent {
    public authService = inject(AuthService);
    public route = inject(Router);

    public visible = model.required<boolean>();
    public user = this.authService.currentUser();

    public redirect(path: RedirectPaths) {
        console.log('🚀 ~ SettingsComponent ~ redirect ~ path:', path);
        if(!this.user) return;
        switch(path) {
            case 'inventory':
                this.route.navigate([ '/inventory' ]);
                break;
            case 'user-settings':
                this.route.navigate([ '/user-settings', this.user.id ]);
                break;
            case 'admin-settings':
                this.route.navigate([ '/admin-settings', this.user.id ]);
                break;
        }
    }

}
