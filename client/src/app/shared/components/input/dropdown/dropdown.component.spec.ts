import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DropdownComponent } from './dropdown.component';

@Component({
    template: `<form [formGroup]="form">
        <app-dropdown formControlName="field" [options]="[]" ngDefaultControl></app-dropdown>
    </form>`,
    standalone: true,
    imports: [ReactiveFormsModule, DropdownComponent],
})
class TestHostComponent {
    form = new FormGroup({ field: new FormControl(null) });
}

describe('DropdownComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: DropdownComponent<unknown>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(DropdownComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
