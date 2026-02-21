import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DropdownComponent } from '../../../shared/components/input/dropdown/dropdown.component';
import { CreateUserFormComponent } from './create-user-form.component';

describe('CreateUserFormComponent', () => {
    let component: CreateUserFormComponent;
    let fixture: ComponentFixture<CreateUserFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateUserFormComponent],
            providers: [provideRouter([]), provideHttpClient()],
        })
        .overrideComponent(DropdownComponent, { set: { template: '' } })
        .compileComponents();

        fixture = TestBed.createComponent(CreateUserFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
