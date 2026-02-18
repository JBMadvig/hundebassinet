import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { generateId } from '@lib/utils';

type TextPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
    selector: 'app-switch',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './switch.component.html',
    styleUrl: './switch.component.css',
})
export class SwitchComponent implements OnInit {
    private formGroupDirective = inject(FormGroupDirective);
    public formControlNameDirective = inject(FormControlName);

    /**
     * The label for the toggle switch.
     *
     * Default is `null` (no label).
     */
    public label = input<string | null>(null);

    /**
     * The position of the label relative to the toggle switch.
     *
     * Options are
     * - `'top'` (default) - Places the label above the toggle.
     * - `'right'` - Places the label to the right of the toggle.
     * - `'bottom'` - Places the label below the toggle.
     * - `'left'` - Places the label to the left of the toggle.
     */
    public textPosition = input<TextPosition>('top');

    /**
     * Label shown to the left of the toggle, representing the "off" (false) state.
     *
     * Default is `null` (no label).
     */
    public falseLabel = input<string | null>(null);

    /**
     * Label shown to the right of the toggle, representing the "on" (true) state.
     *
     * Default is `null` (no label).
     */
    public trueLabel = input<string | null>(null);

    public valueFormGroup: FormGroup | null = null;
    public valueFormControl: FormControl | null = null;
    public controlId = generateId(10);

    ngOnInit() {
        this.valueFormGroup = this.formGroupDirective.form;
        this.valueFormControl = this.formGroupDirective.getControl(this.formControlNameDirective);
    }
}

