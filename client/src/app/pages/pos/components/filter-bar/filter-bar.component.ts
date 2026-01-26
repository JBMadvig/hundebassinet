import { CommonModule } from '@angular/common';
import { Component, computed, output, signal } from '@angular/core';

import { Item, PrimaryItemCategoriesType } from '../../../../shared/types/items.types';
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

    public currentFilter = signal<PrimaryItemCategoriesType | 'all' | 'search'>('all');

    public currentFilterOutput = output<PrimaryItemCategoriesType | 'all' | 'search'>();

    public currentStockFilter = computed(() => {
        const inStockItems = this.items.filter(item => item.currentStock > 0);
        const categories = inStockItems.map(item => item.primaryItemCategory);
        return [ ...new Set(categories) ];
    });

    public onFilterChange(newFilter: PrimaryItemCategoriesType | 'all' | 'search') {
        this.currentFilter.set(newFilter);
        this.currentFilterOutput.emit(newFilter);
    }
}
