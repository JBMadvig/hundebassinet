import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWithQuantity } from '../../../../../../../shared/types/items.types';
import { BasketItemComponent } from './basket-item.component';

describe('BasketItemComponent', () => {
    let component: BasketItemComponent;
    let fixture: ComponentFixture<BasketItemComponent>;

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
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as ItemWithQuantity;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BasketItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BasketItemComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('item', mockItem);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
