import { Injectable, signal } from '@angular/core';

import { FilterType } from './../..//shared/types/items.types';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {

    public currentFilter = signal<FilterType>('all');

    public searchQuery = signal<string>('');

    constructor() { }
}
