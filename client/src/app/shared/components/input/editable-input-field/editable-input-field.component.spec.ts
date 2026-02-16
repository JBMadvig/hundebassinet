import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableInputFieldComponent } from './editable-input-field.component';

describe('EditableInputFieldComponent', () => {
    let component: EditableInputFieldComponent;
    let fixture: ComponentFixture<EditableInputFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ EditableInputFieldComponent ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditableInputFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
