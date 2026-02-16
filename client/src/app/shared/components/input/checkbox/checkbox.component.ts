import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { generateId } from '@lib/utils';

type LabelPosition = 'top' | 'left' | 'right' | 'bottom';

@Component({
    selector: 'app-checkbox',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.css',
})
export class CheckboxComponent implements OnInit {
    private formGroupDirective = inject(FormGroupDirective);
    private formControlNameDirective = inject(FormControlName);

    /**
     * The displayed text label for the checkbox.
     */
    public label = input<string | null>(null);

    /**
     * The position of the label relative to the checkbox.
     *
     * Possible values are
     * - `'top'` - Places the label above the checkbox,
     * - `'left'` - Places the label to the left of the checkbox,
     * - `'right'` - Places the label to the right of the checkbox,
     * - `'bottom'` - Places the label below the checkbox.
     */
    public labelPosition = input<LabelPosition>('top');

    /**
     * The size of the text label for the checkbox.
     *
     * Possible values are
     * - `'small'` - Small text size (text-xs),
     * - `'medium'` - Medium text size (text-sm),
     * - `'regular'` - Large text size (text-base).
     */
    public textSize = input<'small' | 'medium' | 'regular'>('regular');

    /**
     * The horizontal alignment of the checkbox relative to the label.
     *
     * Possible values are
     * - `'top'` - Aligns the checkbox to the top of the label,
     * - `'center'` - Centers the checkbox horizontally with the label.
     */
    public checkboxAlign = input<'top' | 'center'>('center');

    public valueFormGroup: FormGroup | null = null;
    public valueFormControl: FormControl | null = null;
    public controlId = generateId(10);

    get controlName() {
        return this.formControlNameDirective.name;
    }

    get value() {
        return this.valueFormControl?.value;
    }

    ngOnInit() {
        this.valueFormGroup = this.formGroupDirective.form;
        this.valueFormControl = this.formGroupDirective.getControl(this.formControlNameDirective);
    }
}
