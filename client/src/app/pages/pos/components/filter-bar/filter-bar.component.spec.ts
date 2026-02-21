import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
    let component: FilterBarComponent;
    let fixture: ComponentFixture<FilterBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FilterBarComponent);
        component = fixture.componentInstance;
        // Override private items to prevent issues with testdata in test environment
        (component as any)['items'] = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
