import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryService } from '@services/inventory.service';

import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
    let component: FilterBarComponent;
    let fixture: ComponentFixture<FilterBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ FilterBarComponent ],
            providers: [
                { provide: InventoryService, useValue: {
                    getCollectionItems: () => Promise.resolve({ items: [], currency: 'DKK' }),
                } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FilterBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
