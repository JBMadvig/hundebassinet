import { inject, Injectable, resource, signal } from '@angular/core';

import { FilterType, Item } from '../types/items.types';
import { InventoryService } from './inventory.service';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {
    private inventoryService = inject(InventoryService);

    public currentFilter = signal<FilterType>('all');

    public searchQuery = signal<string>('');

    // Shared item list for the /pos collection view and filter bar
    public itemsResource = resource({
        defaultValue: [] as Item[],
        loader: async () => {
            const response = await this.inventoryService.getCollectionItems();
            return response.items;
        },
    });

    constructor() { }
}
