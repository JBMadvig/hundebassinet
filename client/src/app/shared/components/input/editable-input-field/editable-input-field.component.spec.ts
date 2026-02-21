import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { EditableInputFieldComponent } from './editable-input-field.component';

@Component({
    template: `<form [formGroup]="form">
        <app-editable-input-field formControlName="field" ngDefaultControl></app-editable-input-field>
    </form>`,
    standalone: true,
    imports: [ReactiveFormsModule, EditableInputFieldComponent],
})
class TestHostComponent {
    form = new FormGroup({ field: new FormControl('') });
}

describe('EditableInputFieldComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: EditableInputFieldComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(EditableInputFieldComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
