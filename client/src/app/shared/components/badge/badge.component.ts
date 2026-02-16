import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { PrimaryItemCategoriesType, SecondaryItemCategoriesType } from './../../types/items.types';
import { UserRoles } from './../../types/user.types';

type BadgeType = 'role' | 'primaryItemCategory' | 'secondaryItemCategory' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

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
            case 'primaryItemCategory':
                return this.primaryItemCategoryColor(this.badgeText() as PrimaryItemCategoriesType);
            case 'secondaryItemCategory':
                return this.secondaryItemCategoryColor(this.badgeText() as SecondaryItemCategoriesType);
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

    public primaryItemCategoryColor = (primaryItemCategory: PrimaryItemCategoriesType): string => {
        switch (primaryItemCategory) {
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

    public secondaryItemCategoryColor = (secondaryItemCategory: SecondaryItemCategoriesType): string => {
        switch (secondaryItemCategory) {
            // Beer Types - amber colors (100, 200, 300, 400, 500, 600, 800, 900, 950, then back to 100)
            case 'amber ale':
                return 'bg-amber-100 text-black border-amber-100';
            case 'american ipa':
                return 'bg-amber-200 text-black border-amber-200';
            case 'barleywine':
                return 'bg-amber-300 text-black border-amber-300';
            case 'belgian ale':
                return 'bg-amber-400 text-black border-amber-400';
            case 'belgian ipa':
                return 'bg-amber-500 text-black border-amber-500';
            case 'black ipa':
                return 'bg-amber-600 text-white border-amber-600';
            case 'bock':
                return 'bg-amber-800 text-white border-amber-800';
            case 'brown ale':
                return 'bg-amber-900 text-white border-amber-900';
            case 'cream ale':
                return 'bg-amber-950 text-white border-amber-950';
            case 'double ipa':
                return 'bg-amber-100 text-black border-amber-100';
            case 'east coast ipa':
                return 'bg-amber-200 text-black border-amber-200';
            case 'english ipa':
                return 'bg-amber-300 text-black border-amber-300';
            case 'hazy ipa':
                return 'bg-amber-400 text-black border-amber-400';
            case 'hefeweizen':
                return 'bg-amber-500 text-black border-amber-500';
            case 'imperial ipa':
                return 'bg-amber-600 text-white border-amber-600';
            case 'ipa':
                return 'bg-amber-800 text-white border-amber-800';
            case 'kolsch':
                return 'bg-amber-900 text-white border-amber-900';
            case 'lager':
                return 'bg-amber-950 text-white border-amber-950';
            case 'milkshake ipa':
                return 'bg-amber-100 text-black border-amber-100';
            case 'new england ipa':
                return 'bg-amber-200 text-black border-amber-200';
            case 'pale ale':
                return 'bg-amber-300 text-black border-amber-300';
            case 'pilsner':
                return 'bg-amber-400 text-black border-amber-400';
            case 'porter':
                return 'bg-amber-500 text-black border-amber-500';
            case 'red ale':
                return 'bg-amber-600 text-white border-amber-600';
            case 'saison':
                return 'bg-amber-800 text-white border-amber-800';
            case 'session ipa':
                return 'bg-amber-900 text-white border-amber-900';
            case 'sour':
                return 'bg-amber-950 text-white border-amber-950';
            case 'stout':
                return 'bg-amber-100 text-black border-amber-100';
            case 'triple ipa':
                return 'bg-amber-200 text-black border-amber-200';
            case 'west coast ipa':
                return 'bg-amber-300 text-black border-amber-300';
            case 'wheat beer':
                return 'bg-amber-400 text-black border-amber-400';
            case 'white ipa':
                return 'bg-amber-500 text-black border-amber-500';

            // Cider Types - lime colors
            case 'apple cider':
                return 'bg-lime-100 text-black border-lime-100';
            case 'berry cider':
                return 'bg-lime-200 text-black border-lime-200';
            case 'dry cider':
                return 'bg-lime-300 text-black border-lime-300';
            case 'fruit cider':
                return 'bg-lime-400 text-black border-lime-400';
            case 'hard cider':
                return 'bg-lime-500 text-black border-lime-500';
            case 'hopped cider':
                return 'bg-lime-600 text-white border-lime-600';
            case 'ice cider':
                return 'bg-lime-800 text-white border-lime-800';
            case 'perry':
                return 'bg-lime-900 text-white border-lime-900';
            case 'rosé cider':
                return 'bg-lime-950 text-white border-lime-950';
            case 'scrumpy':
                return 'bg-lime-100 text-black border-lime-100';
            case 'semi-dry cider':
                return 'bg-lime-200 text-black border-lime-200';
            case 'semi-sweet cider':
                return 'bg-lime-300 text-black border-lime-300';
            case 'sweet cider':
                return 'bg-lime-400 text-black border-lime-400';

            // Soda Types - purple colors
            case 'coca cola':
                return 'bg-purple-100 text-black border-purple-100';
            case 'coca cola zero':
                return 'bg-purple-200 text-black border-purple-200';
            case 'fanta orange':
                return 'bg-purple-300 text-black border-purple-300';
            case 'faxe kondi':
                return 'bg-purple-400 text-black border-purple-400';
            case 'pepsi':
                return 'bg-purple-500 text-black border-purple-500';
            case 'pepsi max':
                return 'bg-purple-600 text-white border-purple-600';
            case 'sweppes lemon':
                return 'bg-purple-800 text-white border-purple-800';

            // Wine Types - red colors
            case 'white':
                return 'bg-red-100 text-black border-red-100';
            case 'champagne':
                return 'bg-red-200 text-black border-red-200';
            case 'sparkling':
                return 'bg-red-300 text-black border-red-300';
            case 'rosé':
                return 'bg-red-400 text-black border-red-400';
            case 'orange':
                return 'bg-red-500 text-black border-red-500';
            case 'red':
                return 'bg-red-600 text-white border-red-600';
            case 'portwine':
                return 'bg-red-800 text-white border-red-800';

            // Spirit Types - indigo colors
            case 'absinthe':
                return 'bg-indigo-100 text-black border-indigo-100';
            case 'bourbon':
                return 'bg-indigo-200 text-black border-indigo-200';
            case 'brandy':
                return 'bg-indigo-300 text-black border-indigo-300';
            case 'cognac':
                return 'bg-indigo-400 text-black border-indigo-400';
            case 'gin':
                return 'bg-indigo-500 text-white border-indigo-500';
            case 'irish whiskey':
                return 'bg-indigo-600 text-white border-indigo-600';
            case 'liqueur':
                return 'bg-indigo-800 text-white border-indigo-800';
            case 'mezcal':
                return 'bg-indigo-900 text-white border-indigo-900';
            case 'rum':
                return 'bg-indigo-950 text-white border-indigo-950';
            case 'rye whiskey':
                return 'bg-indigo-100 text-black border-indigo-100';
            case 'schnapps':
                return 'bg-indigo-200 text-black border-indigo-200';
            case 'scotch':
                return 'bg-indigo-300 text-black border-indigo-300';
            case 'tequila':
                return 'bg-indigo-400 text-black border-indigo-400';
            case 'vodka':
                return 'bg-indigo-500 text-white border-indigo-500';
            case 'whiskey':
                return 'bg-indigo-600 text-white border-indigo-600';

            // Other
            case 'other':
                return 'bg-stone-100 text-black border-stone-100';
            default:
                return 'bg-stone-100 text-black border-stone-100';
        }
    };
}
