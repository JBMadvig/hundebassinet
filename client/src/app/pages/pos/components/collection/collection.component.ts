import { Component, computed, inject } from '@angular/core';

import { CollectionService } from '@services/collection.service';

import { Item } from '../../../../shared/types/items.types';
import { testItems } from '../../testdata';
import { ItemComponent } from './item/item.component';

@Component({
    selector: 'app-collection',
    imports: [
        ItemComponent,
    ],
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.css',
})
export class CollectionComponent {
    private collectionService = inject(CollectionService);

    public items: Item[] = testItems;

    public currentFilter = this.collectionService.currentFilter;

    public sortAndFilterCategories = computed(()=> {
        // Filter items based on selected category
        let filteredItems: Item[];
        if (this.currentFilter() === 'all') {
            filteredItems = this.items;
        } else {
            filteredItems = this.items.filter(item => item.primaryItemCategory === this.currentFilter());
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
