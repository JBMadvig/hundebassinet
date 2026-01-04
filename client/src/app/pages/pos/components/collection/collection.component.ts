import { Component, computed } from '@angular/core';

import { Item } from '../../../../shared/types/items.types';
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

    public categorySortedItemsComputedValue = computed(()=> {
        // Sort items by primaryItemCategory. Return as Item[]
        return this.items.slice().sort((a, b) => {
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
