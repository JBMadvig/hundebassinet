import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Item } from '../../../../../shared/types/items.types';
import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
    let component: ItemComponent;
    let fixture: ComponentFixture<ItemComponent>;

    const mockItem = {
        id: 'test-1',
        primaryItemCategory: 'beer',
        secondaryItemCategory: 'pilsner',
        name: 'Test Beer',
        averagePrice: 20,
        currentStock: 5,
        totalStockValue: 100,
        abv: 5.0,
        volume: 33,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Item;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('item', mockItem);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
