import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
    let component: TableComponent<{ id: string } | { key: string }>;
    let fixture: ComponentFixture<TableComponent<{ id: string } | { key: string }>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('data', []);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
