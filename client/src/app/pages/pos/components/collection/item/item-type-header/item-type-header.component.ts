import { Component, computed, input } from '@angular/core';

import { Item } from '../../../../../../shared/types/items.types';

@Component({
    selector: 'app-item-type-header',
    imports: [],
    templateUrl: './item-type-header.component.html',
    styleUrl: './item-type-header.component.css',
})
export class ItemTypeHeaderComponent {

    public itemTypeId = input.required<Item['primaryCategory']>();

    // Colors mirror BadgeComponent's primaryCategoryColor mapping, so a category reads the same way everywhere.
    public itemTypeClass = computed(() => {
        switch (this.itemTypeId()) {
            case 'beer':
                return 'bg-nb-yellow';
            case 'cider':
                return 'bg-lime-400';
            case 'wine':
                return 'bg-nb-red';
            case 'spirit':
                return 'bg-nb-blue';
            case 'soda':
                return 'bg-nb-violet';
            case 'other':
                return 'bg-foreground';
            default:
                return 'bg-foreground';
        }
    });
}
