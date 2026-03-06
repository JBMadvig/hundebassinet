import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { PrimaryCategoriesType } from '../../../../../shared/types/items.types';

@Component({
    selector: 'app-filter-bar-button',
    imports: [
        CommonModule,
    ],
    templateUrl: './filter-bar-button.component.html',
    styleUrl: './filter-bar-button.component.css',
})
export class FilterBarButtonComponent {

    public category = input.required<PrimaryCategoriesType | 'all' | 'search'>();
    public currentFilter = input.required<PrimaryCategoriesType | 'all' | 'search'>();

    public filterChange = output<PrimaryCategoriesType | 'all' | 'search'>();

    public onClick() {
        this.filterChange.emit(this.category());
    }
}
