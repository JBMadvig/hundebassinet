import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { PrimaryItemCategoriesType } from '../../../../../shared/types/items.types';

@Component({
    selector: 'app-filter-bar-button',
    imports: [
        CommonModule,
    ],
    templateUrl: './filter-bar-button.component.html',
    styleUrl: './filter-bar-button.component.css',
})
export class FilterBarButtonComponent {

    public itemCategory = input.required<PrimaryItemCategoriesType | 'all'>();
    public currentFilter = input.required<PrimaryItemCategoriesType | 'all'>();

    public filterChange = output<PrimaryItemCategoriesType | 'all'>();

    public categoryBackground = computed(() => {
        switch (this.itemCategory()) {
            case 'beer':
                if(this.currentFilter() === 'beer') {
                    return 'bg-amber-500';
                }
                return 'bg-amber-200';
            case 'cider':
                if(this.currentFilter() === 'cider') {
                    return 'bg-green-500';
                }
                return 'bg-green-200';
            case 'wine':
                if(this.currentFilter() === 'wine') {
                    return 'bg-purple-500';
                }
                return 'bg-purple-200';
            case 'spirit':
                if(this.currentFilter() === 'spirit') {
                    return 'bg-red-500';
                }
                return 'bg-red-200';
            case 'soda':
                if(this.currentFilter() === 'soda') {
                    return 'bg-blue-500';
                }
                return 'bg-blue-200';
            case 'other':
                if(this.currentFilter() === 'other') {
                    return 'bg-gray-500';
                }
                return 'bg-gray-200';
            case 'all':
                return 'bg-yellow-200';
            default:
                return 'bg-stone-500';
        }
    });

    public onClick() {
        this.filterChange.emit(this.itemCategory());
    }
}
