import { Component, computed, inject, output } from '@angular/core';

import { BadgeComponent } from '@components/badge/badge.component';
import { LocaleCurrencyPipe } from '@pipes/locale-currency.pipe';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-sidebar-user-details',
    imports: [
        BadgeComponent,
        LocaleCurrencyPipe,
    ],
    templateUrl: './sidebar-user-details.component.html',
    styleUrl: './sidebar-user-details.component.css',
})
export class SidebarUserDetailsComponent {
    private authService = inject(AuthService);

    // Since this page can only be accessed by authenticated users, we can safely assert that currentUser is not null.
    public userDetail = this.authService.currentUser()!;
    public currencyInfo = this.authService.currencyInfo;

    public openSettings = output();

    public userNameInitalComputedValue = computed((): string => {
        if (!this.userDetail?.name) {
            return 'USER';
        }

        const names = this.userDetail.name.trim().split(/\s+/);

        switch (names.length) {
            case 1:
            // Single name: return first letter
                return names[0].charAt(0).toUpperCase();
            case 2:
            // Two names: return first letter of each
                return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
            default:
            // More than 2 names: return first letter of first and last name
                return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
        }
    });

}
