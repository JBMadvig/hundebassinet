import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryService } from '@services/inventory.service';

import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let component: CollectionComponent;
    let fixture: ComponentFixture<CollectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ CollectionComponent ],
            providers: [
                { provide: InventoryService, useValue: {
                    getCollectionItems: () => Promise.resolve({ items: [], currency: 'DKK' }),
                } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CollectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
