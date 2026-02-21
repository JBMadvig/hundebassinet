import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeHeaderComponent } from './item-type-header.component';

describe('ItemTypeHeaderComponent', () => {
    let component: ItemTypeHeaderComponent;
    let fixture: ComponentFixture<ItemTypeHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemTypeHeaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemTypeHeaderComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('itemTypeId', 'beer');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
