import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

import { InputFieldComponent } from '@components/input-field/input-field.component';
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

    public toggleEditing() {
        this.isEditView.update((editMode) => !editMode);
    }

    public submit() {
        this.valueChange.emit(this.value);
        this.isEditView.set(false);
    }


}
