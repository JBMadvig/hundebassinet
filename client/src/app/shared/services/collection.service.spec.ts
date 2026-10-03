import { TestBed } from '@angular/core/testing';

import { CollectionService } from './collection.service';
import { InventoryService } from './inventory.service';

describe('CollectionService', () => {
    let service: CollectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: InventoryService, useValue: {
                    getCollectionItems: () => Promise.resolve({ items: [], currency: 'DKK' }),
                } },
            ],
        });
        service = TestBed.inject(CollectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
