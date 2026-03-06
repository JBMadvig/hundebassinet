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
                return 'bg-gray-700 text-gray-50 border-gray-700';
            case 'success':
                return 'bg-success/15 text-success border-success/25';
            case 'danger':
                return 'bg-error/15 text-error border-error/25';
            case 'warning':
                return 'bg-warning/15 text-warning border-warning/25';
            case 'info':
                return 'bg-info-bg text-white border border-info-bg';
            case 'neutral':
                return 'bg-highlight text-text-on-light border-highlight border';
        }

    });

    public roleTypeColor = (role: UserRoles): string => {
        switch (role) {
            case 'user':
                return 'bg-green-700 text-green-50 border-green-700';
            case 'admin':
                return 'bg-red-700 text-red-50 border-red-700';
            case 'sudo-admin':
                return 'bg-slate-700 text-slate-50 border-slate-700';
            default:
                return 'bg-stone-700 text-stone-50 border-stone-700';
        }
    };

    public primaryCategoryColor = (primaryCategory: PrimaryCategoriesType): string => {
        switch (primaryCategory) {
            case 'beer':
                return 'bg-amber-700 text-amber-50 border-amber-700';
            case 'cider':
                return 'bg-lime-700 text-lime-50 border-lime-700';
            case 'soda':
                return 'bg-purple-700 text-purple-50 border-purple-700';
            case 'wine':
                return 'bg-red-700 text-red-50 border-red-700';
            case 'spirit':
                return 'bg-indigo-700 text-indigo-50 border-indigo-700';
            case 'other':
                return 'bg-zinc-100 text-zinc-800 border-zinc-200';
            default:
                return 'bg-stone-700 text-stone-50 border-stone-700';
        }
    };
}
