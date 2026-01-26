import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

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

    public itemCategory = input.required<PrimaryItemCategoriesType | 'all' | 'search'>();
    public currentFilter = input.required<PrimaryItemCategoriesType | 'all' | 'search'>();

    public filterChange = output<PrimaryItemCategoriesType | 'all' | 'search'>();

    public onClick() {
        this.filterChange.emit(this.itemCategory());
    }
}
