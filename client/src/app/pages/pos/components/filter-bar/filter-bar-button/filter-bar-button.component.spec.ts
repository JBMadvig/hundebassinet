import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBarButtonComponent } from './filter-bar-button.component';

describe('FilterBarButtonComponent', () => {
    let component: FilterBarButtonComponent;
    let fixture: ComponentFixture<FilterBarButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterBarButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FilterBarButtonComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('itemCategory', 'all');
        fixture.componentRef.setInput('currentFilter', 'all');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
