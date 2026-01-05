import { Component, computed, signal } from '@angular/core';

import { Item, PrimaryItemCategoriesType } from '../../../../shared/types/items.types';
import { testItems } from '../../testdata';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { ItemComponent } from './item/item.component';

@Component({
    selector: 'app-collection',
    imports: [
        ItemComponent,
        FilterBarComponent,
    ],
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.css',
})
export class CollectionComponent {

    public items: Item[] = testItems;

    public filterByCategory = signal<PrimaryItemCategoriesType | 'all'>('all');

    public sortAndFilterCategories = computed(()=> {
        // Filter items based on selected category
        let filteredItems: Item[];
        if (this.filterByCategory() === 'all') {
            filteredItems = this.items;
        } else {
            filteredItems = this.items.filter(item => item.primaryItemCategory === this.filterByCategory());
        }
        // Sort items by primaryItemCategory. Return as Item[]
        return filteredItems.slice().sort((a, b) => {
            if (a.primaryItemCategory < b.primaryItemCategory) {
                return -1;
            }
            if (a.primaryItemCategory > b.primaryItemCategory) {
                return 1;
            }
            return 0;
        });
    });

}
