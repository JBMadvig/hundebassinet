import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { FilterType } from '../../../../../shared/types/items.types';

@Component({
    selector: 'app-filter-bar-button',
    imports: [
        CommonModule,
    ],
    templateUrl: './filter-bar-button.component.html',
    styleUrl: './filter-bar-button.component.css',
})
export class FilterBarButtonComponent {

    public category = input.required<FilterType>();
    public currentFilter = input.required<FilterType>();

    public filterChange = output<FilterType>();

    public filterButtonColor = computed(() => {
        switch (this.category()) {
            case 'beer':
                return 'bg-nb-yellow';
            case 'cider':
                return 'bg-lime-400';
            case 'soda':
                return 'bg-nb-violet';
            case 'wine':
                return 'bg-nb-red';
            case 'spirit':
                return 'bg-nb-blue';
            case 'all':
                return 'bg-secondary-background';
            case 'search':
                return 'bg-main';
            default:
                return 'bg-secondary-background';
        }
    });

    // Tailwind only picks up complete, literal class strings, so hover/opacity
    // variants can't be built by concatenating filterButtonColor() at runtime.
    public filterButtonHoverClass = computed(() => {
        switch (this.category()) {
            case 'beer':
                return 'hover:bg-nb-yellow';
            case 'cider':
                return 'hover:bg-lime-400';
            case 'soda':
                return 'hover:bg-nb-violet';
            case 'wine':
                return 'hover:bg-nb-red';
            case 'spirit':
                return 'hover:bg-nb-blue';
            case 'all':
                return 'hover:bg-secondary-background';
            case 'search':
                return 'hover:bg-main';
            default:
                return 'hover:bg-secondary-background';
        }
    });

    public filterButtonActiveClass = computed(() => {
        switch (this.category()) {
            case 'beer':
                return 'bg-nb-yellow/30';
            case 'cider':
                return 'bg-lime-400/30';
            case 'soda':
                return 'bg-nb-violet/30';
            case 'wine':
                return 'bg-nb-red/30';
            case 'spirit':
                return 'bg-nb-blue/30';
            case 'all':
                return 'bg-secondary-background/30';
            case 'search':
                return 'bg-main/30';
            default:
                return 'bg-secondary-background/30';
        }
    });

    public onClick() {
        this.filterChange.emit(this.category());
    }
}
