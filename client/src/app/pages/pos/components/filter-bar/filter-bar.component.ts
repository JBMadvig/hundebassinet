import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';

import { Item } from '../../../../shared/types/items.types';
import { testItems } from '../../testdata';
import { FilterBarButtonComponent } from './filter-bar-button/filter-bar-button.component';

@Component({
    selector: 'app-filter-bar',
    imports: [
        CommonModule,
        FilterBarButtonComponent,
    ],
    templateUrl: './filter-bar.component.html',
    styleUrl: './filter-bar.component.css',
})
export class FilterBarComponent {

    private items: Item[] = testItems;

    public currentStockFilter = computed(() => {
        const inStockItems = this.items.filter(item => item.currentStock > 0);
        const categories = inStockItems.map(item => item.primaryItemCategory);
        return [ ...new Set(categories) ];
    });
}
