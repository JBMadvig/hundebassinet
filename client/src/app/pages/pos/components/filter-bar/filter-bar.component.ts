import { CommonModule } from '@angular/common';
import { Component, computed, output, signal } from '@angular/core';

import { Item, PrimaryCategoriesType } from '../../../../shared/types/items.types';
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

    public currentFilter = signal<PrimaryCategoriesType | 'all' | 'search'>('all');

    public currentFilterOutput = output<PrimaryCategoriesType | 'all' | 'search'>();

    public currentStockFilter = computed(() => {
        const inStockItems = this.items.filter(item => item.currentStock > 0);
        const categories = inStockItems.map(item => item.primaryCategory);
        return [ ...new Set(categories) ];
    });

    public onFilterChange(newFilter: PrimaryCategoriesType | 'all' | 'search') {
        // If we press the search button while we are already in search mode, we want to go back to the all filter. This is a toggle behavior for the search filter.
        if(this.currentFilter() === 'search' && newFilter === 'search') {
            this.currentFilter.set('all');
            this.currentFilterOutput.emit('all');
            return;
        }

        this.currentFilter.set(newFilter);
        this.currentFilterOutput.emit(newFilter);

    }
}
