import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { Item } from '../../../../../shared/types/items.types';

@Component({
    selector: 'app-filter-bar-button',
    imports: [
        CommonModule,
    ],
    templateUrl: './filter-bar-button.component.html',
    styleUrl: './filter-bar-button.component.css',
})
export class FilterBarButtonComponent {

    public item = input.required<Item['primaryItemCategory']>();

    public categoryBackground = computed(() => {
        switch (this.item()) {
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
