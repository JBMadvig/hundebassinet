import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { PrimaryCategoriesType } from './../../types/items.types';
import { UserRoles } from './../../types/user.types';

type BadgeType = 'role' | 'primaryCategory' | 'secondaryCategory' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

@Component({
    selector: 'app-badge',
    imports: [
        CommonModule,
    ],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.css',
})
export class BadgeComponent {

    public badgeType = input.required<BadgeType>();
    public badgeText = input.required<string>();

    public badgeColors = computed(() => {
        switch (this.badgeType()) {
            case 'role':
                return this.roleTypeColor(this.badgeText() as UserRoles);
            case 'primaryCategory':
                return this.primaryCategoryColor(this.badgeText() as PrimaryCategoriesType);
                // Need to handle secondary categories separately since they can be any string, not just a predefined set -- Maybe return primary color in a lighter shade or a neutral color?
            case 'secondaryCategory':
                return 'bg-secondary-background';
            case 'success':
                return 'bg-nb-green';
            case 'danger':
                return 'bg-nb-red';
            case 'warning':
                return 'bg-nb-yellow';
            case 'info':
                return 'bg-nb-blue';
            case 'neutral':
                return 'bg-secondary-background';
        }

    });

    public roleTypeColor = (role: UserRoles): string => {
        switch (role) {
            case 'user':
                return 'bg-nb-green';
            case 'admin':
                return 'bg-nb-red';
            case 'sudo-admin':
                return 'bg-nb-violet';
            default:
                return 'bg-secondary-background';
        }
    };

    public primaryCategoryColor = (primaryCategory: PrimaryCategoriesType): string => {
        switch (primaryCategory) {
            case 'beer':
                return 'bg-nb-yellow';
            case 'cider':
                return 'bg-lime-400';
            case 'soda':
                return 'bg-nb-violet';
            case 'wine':
                return 'bg-nb-red';
            case 'spirit':
                return 'bg-nb-blue';
            case 'other':
                return 'bg-secondary-background';
            default:
                return 'bg-secondary-background';
        }
    };
}
