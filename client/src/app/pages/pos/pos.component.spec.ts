import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CollectionComponent } from './components/collection/collection.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { SidebarUserDetailsComponent } from './components/side-bar/components/sidebar-user-details/sidebar-user-details.component';
import { PosComponent } from './pos.component';

describe('PosComponent', () => {
    let component: PosComponent;
    let fixture: ComponentFixture<PosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PosComponent],
            providers: [provideRouter([])],
        })
        .overrideComponent(FilterBarComponent, { set: { template: '' } })
        .overrideComponent(CollectionComponent, { set: { template: '' } })
        .overrideComponent(SidebarUserDetailsComponent, { set: { template: '' } })
        .compileComponents();

        fixture = TestBed.createComponent(PosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
