import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ComboboxComponent } from './combobox.component';

@Component({
    template: `<form [formGroup]="form">
        <app-combobox formControlName="field" [data]="[]" ngDefaultControl></app-combobox>
    </form>`,
    standalone: true,
    imports: [ReactiveFormsModule, ComboboxComponent],
})
class TestHostComponent {
    form = new FormGroup({ field: new FormControl('') });
}

describe('ComboboxComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: ComboboxComponent<{ id: string; name: string }>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(ComboboxComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
