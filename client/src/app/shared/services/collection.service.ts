import { Injectable, signal } from '@angular/core';

import { PrimaryItemCategoriesType } from './../..//shared/types/items.types';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {

    public currentFilter = signal<PrimaryItemCategoriesType | 'all' | 'search'>('all');

    public searchQuery = signal<string>('');

    constructor() { }
}
