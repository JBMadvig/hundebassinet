import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputFieldComponent } from './input-field.component';

@Component({
    template: `<form [formGroup]="form">
        <app-input-field formControlName="field" ngDefaultControl></app-input-field>
    </form>`,
    standalone: true,
    imports: [ReactiveFormsModule, InputFieldComponent],
})
class TestHostComponent {
    form = new FormGroup({ field: new FormControl('') });
}

describe('InputFieldComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: InputFieldComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(InputFieldComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
