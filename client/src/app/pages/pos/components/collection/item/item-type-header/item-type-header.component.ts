import { Component, computed, input } from '@angular/core';

import { Item } from '../../../../../../shared/types/items.types';

@Component({
    selector: 'app-item-type-header',
    imports: [],
    templateUrl: './item-type-header.component.html',
    styleUrl: './item-type-header.component.css',
})
export class ItemTypeHeaderComponent {

    public itemTypeId = input.required<Item['primaryItemCategory']>();

    // TODO: Make this generic return method since it's also used in filter-bar.component.ts
    public itemTypeClass = computed(() => {
        switch (this.itemTypeId()) {
            case 'beer':
                return 'bg-amber-500';
            case 'cider':
                return 'bg-green-500';
            case 'wine':
                return 'bg-purple-500';
            case 'spirit':
                return 'bg-red-500';
            case 'soda':
                return 'bg-blue-500';
            case 'other':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    });
}
