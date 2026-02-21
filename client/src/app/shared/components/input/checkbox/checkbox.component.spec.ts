import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CheckboxComponent } from './checkbox.component';

@Component({
    template: `<form [formGroup]="form">
        <app-checkbox formControlName="field" ngDefaultControl></app-checkbox>
    </form>`,
    standalone: true,
    imports: [ ReactiveFormsModule, CheckboxComponent ],
})
class TestHostComponent {
    form = new FormGroup({ field: new FormControl(false) });
}

describe('CheckboxComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: CheckboxComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ TestHostComponent ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(CheckboxComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
