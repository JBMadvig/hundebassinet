import { Component, inject, model, output } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectPaths } from 'app/app.routes';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { AuthService } from '@services/auth.service';

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

    public showAddItemsDialog = output();

    public visible = model.required<boolean>();
    public user = this.authService.currentUser();

    public redirect(path: RedirectPaths) {
        if(!this.user) return;
        switch(path) {
            case '/pos/inventory':
                this.route.navigate([ '/pos/inventory' ]);
                break;
            case '/users/me':
                this.route.navigate([ '/users/me' ], { queryParams: { returnTo: '/pos' } });
                break;
            case '/users':
                this.route.navigate([ '/users' ]);
                break;
        }
    }

    public openAddItemsDialog() {
        this.showAddItemsDialog.emit();
        this.visible.set(false);
    }

}
