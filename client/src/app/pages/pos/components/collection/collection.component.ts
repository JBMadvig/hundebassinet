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
    public searchQuery = this.collectionService.searchQuery;

    public sortAndFilterCategories = computed(()=> {
        // Filter items based on selected category
        let filteredItems: Item[];
        switch (this.currentFilter()) {
            case 'all':
                filteredItems = this.items;
                break;
            case 'search':
                filteredItems = this.items.filter(item => item.name.toLowerCase().includes(this.searchQuery().toLowerCase()));
                break;
            default:
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
