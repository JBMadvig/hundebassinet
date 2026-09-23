import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddItemComponent } from './add-item.component';

describe('AddItemComponent', () => {
    let component: AddItemComponent;
    let fixture: ComponentFixture<AddItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ AddItemComponent ],
            providers: [ provideRouter([]), provideHttpClient() ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
