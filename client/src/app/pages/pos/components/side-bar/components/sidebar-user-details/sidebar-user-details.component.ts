import { Component, computed, inject, output } from '@angular/core';

import { AuthService } from '@services/auth.service';

import { BadgeComponent } from '../../../../../../shared/components/badge/badge.component';

@Component({
    selector: 'app-sidebar-user-details',
    imports: [
        BadgeComponent,
    ],
    templateUrl: './sidebar-user-details.component.html',
    styleUrl: './sidebar-user-details.component.css',
})
export class SidebarUserDetailsComponent {
    private authService = inject(AuthService);

    // Since this page can only be accessed by authenticated users, we can safely assert that currentUser is not null.
    public userDetail = this.authService.currentUser()!;

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
