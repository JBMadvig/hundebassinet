import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let component: CollectionComponent;
    let fixture: ComponentFixture<CollectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CollectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CollectionComponent);
        component = fixture.componentInstance;
        // Override private items to prevent issues with testdata in test environment
        (component as any)['items'] = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
