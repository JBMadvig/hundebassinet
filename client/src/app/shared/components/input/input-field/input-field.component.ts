import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { AutofocusDirective } from '@directives/auto-focus.directive';
import { generateId } from '@lib/utils';

@Component({
    selector: 'app-input-field',
    imports: [ CommonModule, ReactiveFormsModule, AutofocusDirective ],
    templateUrl: './input-field.component.html',
    styleUrls: [ './input-field.component.css' ],
})
@AutoUnsubscribe()
export class InputFieldComponent implements OnInit {
    private formControlNameDirective = inject(FormControlName);

    /**
     * The type of the input field.
     */
    public type = input<'text' | 'password' | 'number'>('text');

    /**
     * The placeholder of the input field.
     * This is the text that is displayed when the input field is empty.
     */
    public placeholder = input<string>('');

    /**
     * The label of the input field.
     * This is the text that is displayed above the input field.
     */
    public label = input<string>('');

    /**
     * The icon of the input field.
     * This is the icon that is displayed inside the input field.
     * It should be given as a font-awesome icon class.
     */
    public icon = input<string | null>(null);

    /**
     * Whether the input field should autofocus or not.
     * If true, the input field will be focused when the component is loaded.
    */
    public autofocus = input(false, { transform: booleanAttribute });

    /**
     * Whether the input field should have a left border or not.
     * If true, the input field will not have a left border.
     *
     * This is useful when multiple input fields are used in a row to avoid
     * double borders between the input fields.
     */
    public noLeftBorder = input(false, { transform: booleanAttribute });

    /**
     * If this is true, add class 'text-text-primary' to label.
     */
    public textOnDark = input(false, { transform: booleanAttribute });

    /**
     * The value of the input field.
     * It is used to programmatically set the value.
     */
    public value = input<unknown>(null);

    /**
     * The minimum and maximum values of the input field.
     * This is only relevant when the type is 'number'.
     */
    public min = input<number | null>(null);
    public max = input<number | null>(null);

    /**
     * The theme of the input field.
     * 'dark' theme will have darker borders.
     */
    public theme = input<'light' | 'dark'>('light');

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

    /**
     * Emits the value of the input field.
     * This is emitted on every keypress.
     */
    public valueChange = output<string>();
    public focusChange = output<boolean>();

    /**
     * Changes the input field to a error state so you can show an error visually
    */
    public isInvalid = signal<boolean>(false);

    /**
     * Toggle to show / hide the validation explainer if validationCindition is the one that is triggered.
    */
    public validationError = signal<boolean>(false);


    /**
     * Whether the input field is required or not.
     * This will add a black asterisk to the label.
     */
    public isRequired = signal<boolean>(false);

    /**
     * Signal to show or hide the password input field.
     * Default is false.
     */
    public toggleShowPassword = signal<boolean>(false);

    public controlId = generateId(10);
    public valueFormGroup?: FormGroup;
    public valueFormControl?: FormControl;

    ngOnInit() {
        this.valueFormControl = this.formControlNameDirective.control as FormControl;
        this.valueFormGroup = this.valueFormControl.parent as FormGroup;
        this.isRequired.set(this.valueFormControl.hasValidator(Validators.required));

        AutoSub(this).reg['checkForInvalidFormControlSub'] = this.valueFormControl?.valueChanges
            .subscribe(() => {
                const control = this.valueFormControl;
                if(!control) return;

                const condition = this.validationCondition();
                const hasError = condition !== null && (
                    control.hasError(condition) || (this.valueFormGroup?.hasError(condition) ?? false)
                );

                if (hasError) {
                    this.validationError.set(true);
                    this.isInvalid.set(true);
                } else {
                    this.validationError.set(false);
                    this.isInvalid.set(control.invalid ?? false);
                }
            });

        AutoSub(this).reg['checkGroupStatusSub'] = this.valueFormGroup?.statusChanges
            .subscribe(() => {
                const condition = this.validationCondition();
                if (!condition) return;
                const hasError = (this.valueFormControl?.hasError(condition) ?? false)
                    || (this.valueFormGroup?.hasError(condition) ?? false);
                this.validationError.set(hasError);
                if (hasError) this.isInvalid.set(true);
            });
    }

    get explainerList(): string[] {
        const explanation = this.validationExplainer();
        if (Array.isArray(explanation)) return explanation;
        return explanation ? [ explanation ] : [];
    }

    get controlName() {
        return this.formControlNameDirective.name;
    }

    get enabled() {
        return this.valueFormControl?.enabled;
    }

    get formattedValue() {
        const value: string = this.valueFormControl?.value;
        if (!value) {
            // No value => return label
            return this.label();
        }

        if (this.type() == 'password') {
            return value.replaceAll(/./g, '•');
        }
        return this.valueFormControl?.value;
    }

    public onInput() {
        this.valueChange.emit(this.valueFormControl?.value);
    }

    public onFocus() {
        this.focusChange.emit(true);
    }

    public onBlur() {
        this.focusChange.emit(false);
    }

    public togglePasswordVisibility() {
        this.toggleShowPassword.update(value => !value);
    }

    public onClearField() {
        this.valueFormControl?.setValue('');
        this.valueChange.emit('');
    }
}
