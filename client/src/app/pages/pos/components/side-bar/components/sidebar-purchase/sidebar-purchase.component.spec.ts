import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPurchaseComponent } from './sidebar-purchase.component';

describe('SidebarPurchaseComponent', () => {
    let component: SidebarPurchaseComponent;
    let fixture: ComponentFixture<SidebarPurchaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ SidebarPurchaseComponent ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarPurchaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
