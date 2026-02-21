import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SwitchComponent } from './switch.component';

@Component({
    template: `<form [formGroup]="form">
        <app-switch formControlName="field" ngDefaultControl></app-switch>
    </form>`,
    standalone: true,
    imports: [ReactiveFormsModule, SwitchComponent],
})
class TestHostComponent {
    form = new FormGroup({ field: new FormControl(false) });
}

describe('SwitchComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: SwitchComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(SwitchComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
