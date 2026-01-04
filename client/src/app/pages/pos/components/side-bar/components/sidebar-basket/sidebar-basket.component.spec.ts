import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBasketComponent } from './sidebar-basket.component';

describe('SidebarBasketComponent', () => {
    let component: SidebarBasketComponent;
    let fixture: ComponentFixture<SidebarBasketComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ SidebarBasketComponent ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarBasketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
