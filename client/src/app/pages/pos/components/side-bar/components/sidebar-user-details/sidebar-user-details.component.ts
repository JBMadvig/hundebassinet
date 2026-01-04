import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';

import { BadgeComponent } from '../../../../../../shared/components/badge/badge.component';
import { User } from '../../../../../../shared/types/user.types';

@Component({
    selector: 'app-sidebar-user-details',
    imports: [
        CommonModule,
        BadgeComponent,

    ],
    templateUrl: './sidebar-user-details.component.html',
    styleUrl: './sidebar-user-details.component.css',
})
export class SidebarUserDetailsComponent {

    // TODO: Delete this hardcoded user and fetch the logged in user from auth service
    public userDetail: User = {
        id: '0001',
        name: 'Jonas Madvig',
        email: 'jonas.e.madvig@gmail.com',
        role: 'sudo-admin',
        balance: 300.00,
        valuta: 'DKK',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-12-28'),
    };

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
