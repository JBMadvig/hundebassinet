import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MeComponent } from './me.component';

describe('MeComponent', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MeComponent],
            providers: [provideRouter([]), provideHttpClient()],
        }).compileComponents();

        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
