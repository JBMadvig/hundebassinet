import { Injectable, signal } from '@angular/core';

import { PrimaryCategoriesType } from './../..//shared/types/items.types';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {

    public currentFilter = signal<PrimaryCategoriesType | 'all' | 'search'>('all');

    public searchQuery = signal<string>('');

    constructor() { }
}
