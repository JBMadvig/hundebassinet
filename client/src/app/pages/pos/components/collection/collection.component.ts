import { Component, computed, inject } from '@angular/core';

import { CollectionService } from '@services/collection.service';

import { Item } from '../../../../shared/types/items.types';
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

    public itemsResource = this.collectionService.itemsResource;

    public currentFilter = this.collectionService.currentFilter;
    public searchQuery = this.collectionService.searchQuery;

    public sortAndFilterCategories = computed(()=> {
        // Filter items based on selected category
        const items = this.itemsResource.value();
        let filteredItems: Item[];
        switch (this.currentFilter()) {
            case 'all':
                filteredItems = items;
                break;
            case 'search':
                filteredItems = items.filter(item => item.name.toLowerCase().includes(this.searchQuery().toLowerCase()));
                break;
            default:
                filteredItems = items.filter(item => item.primaryCategory === this.currentFilter());
        }

        // Sort items by primaryCategory. Return as Item[]
        return filteredItems.slice().sort((a, b) => {
            if (a.primaryCategory < b.primaryCategory) {
                return -1;
            }
            if (a.primaryCategory > b.primaryCategory) {
                return 1;
            }
            return 0;
        });
    });

}
