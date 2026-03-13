import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { generateId } from '@lib/utils';

@Component({
    selector: 'app-editable-input-field',
    imports: [
        CommonModule,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './editable-input-field.component.html',
    styleUrl: './editable-input-field.component.css',
})
@AutoUnsubscribe()
export class EditableInputFieldComponent implements OnInit {
    private elementRef = inject(ElementRef);
    private formGroupDirective = inject(FormGroupDirective);
    private formControlNameDirective = inject(FormControlName);

    /**
     * The label for the editable info component.
     */
    public label = input<string | null>(null);

    /**
     * Used to determine if the input field is disabled or not.
     */
    public disabled = input(false);

    /**
     * The Validator the validationExplainer is attached to.
     * There can only be 1 validation condition. If more a needed, make a custom validator, to make sure all cases are in a single Validator.
     * Add all new custom validators to the input type
    */
    public validationCondition = input<'required' | 'minlength' | 'email' | 'min' | 'max' | 'pattern' | 'fieldsMismatch' | 'currency' | null>(null);

    /**
     * A custom error description for validation explainers.
     * Accepts both single string and/or arrays of string that will be showed on a <ul>.
     * This is used by input fields, that wants to explain why an input field is not valid, ie:
     * "Passwords needs to be at least 8 characters long"
     * "The confirm password does not match the new password"
     * "Email does not contain '@'"
    */
    public validationExplainer = input<string | string[]>('');

    public placeholder = input<string>('');

    public valueChange = output<string>();

    public valueFormGroup?: FormGroup;
    public valueFormControl?: FormControl;
    public controlId = generateId(10);
    public isEditView = signal(false);

    public invalidFormInput = signal(false);
    public invalidTooltipMessage = input<string>('Invalid input value');

    get value() {
        return this.valueFormControl?.value;
    }

    get controlName() {
        return this.formControlNameDirective.name;
    }

    ngOnInit() {
        this.valueFormGroup = this.formGroupDirective.form;
        this.valueFormControl = this.formGroupDirective.getControl(this.formControlNameDirective);

        AutoSub(this).reg['editableInfoFormControl'] = this.valueFormControl.statusChanges
            .pipe(
                distinctUntilChanged(),
            )
            .subscribe((value) => {
                this.invalidFormInput.update(() => value === 'INVALID');
            });
    }

    get explainerList(): string[] {
        const explanation = this.validationExplainer();
        if (Array.isArray(explanation)) return explanation;
        return explanation ? [ explanation ] : [];
    }

    public toggleEditing() {
        this.isEditView.update((editMode) => !editMode);
    }

    public submit() {
        this.valueChange.emit(this.value);
        this.isEditView.set(false);
    }

    @HostListener('document:click', [ '$event' ])
    public onDocumentClick(event: MouseEvent) {
        if (this.disabled()) return;

        const isInside = this.elementRef.nativeElement.contains(event.target as Node);

        if (isInside && !this.isEditView()) {
            this.isEditView.set(true);
        } else if (!isInside && this.isEditView()) {
            this.isEditView.set(false);
        }
    }
}
