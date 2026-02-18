import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { generateId } from '@lib/utils';

export interface DropdownOption<T = string> {
    text: string;
    value: T;
    hidden?: boolean;
    disabled?: boolean;
}

export interface DropdownOpGroup<T = string> {
    label: string;
    options: DropdownOption<T>[];
}

const isOptGroupArray = <T>(options: DropdownOpGroup<T>[] | DropdownOption<T>[]): options is DropdownOpGroup<T>[] => {
    return options.every((option) => 'label' in option && 'options' in option);
};

@Component({
    selector: 'app-dropdown',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './dropdown.component.html',
    styleUrls: [ './dropdown.component.css' ],
})
@AutoUnsubscribe()
export class DropdownComponent<T> implements OnInit {
    private formGroupDirective = inject(FormGroupDirective);
    private formControlNameDirective = inject(FormControlName);


    /**
     * The options for the dropdown to be shown as selectable items.
     */
    public options = input.required<DropdownOption<T>[] | DropdownOpGroup<T>[]>();

    /**
     * The label of the dropdown.
     *
     * This is the text that is displayed above the dropdown.
     */
    public label = input<string | null>(null);

    /**
     * Whether the dropdown should have a 'Reset' option or not.
     *
     * If this attribute is present, the dropdown will have a 'Reset' option.
     * The reset option will only be displayed if a dropdown has a value selected.
     */
    public resetOption = input(false, { transform: booleanAttribute });

    /**
     * The placeholder of the dropdown.
     *
     * This is the text that is displayed when no value is selected.
     */
    public placeholder = input<string | null>(null);

    /**
     * The output event that is emitted when the value of the dropdown changes.
     *
     * The value is the selected value of the dropdown.
     */
    public valueChange = output<T | null>();

    /**
     * Changes the select to an error state so you can show an error visually
    */
    public isInvalid = signal<boolean>(false);

    /**
     * Whether the dropdown is required or not.
     * This will add a black asterisk to the label.
     */
    public isRequired = signal<boolean>(false);


    public optGroupsWithId = computed(() => {
        let options = this.options();
        if (!isOptGroupArray(options)) {
            options = [ { label: '', options } ];
        }

        return options.map((group) => ({
            id: group.label,
            label: group.label,
            options: group.options.map((option) => ({
                ...option,
                id: JSON.stringify(option.value),
            })),
        }));
    });

    public valueFormGroup?: FormGroup;
    public valueFormControl?: FormControl;
    public controlId = generateId(10);

    get controlName() {
        return this.formControlNameDirective.name;
    }

    get enabled() {
        return this.valueFormControl?.enabled;
    }

    get selectedText(): string {
        const value = this.valueFormControl?.value;
        if (value == null) return this.label() ?? '';
        for (const group of this.optGroupsWithId()) {
            for (const option of group.options) {
                if (option.value === value) return option.text;
            }
        }
        return String(value);
    }

    ngOnInit() {
        this.valueFormGroup = this.formGroupDirective.form;
        this.valueFormControl = this.formGroupDirective.getControl(this.formControlNameDirective);
        this.isRequired.set(this.valueFormControl.hasValidator(Validators.required));

        AutoSub(this).reg['valueChangeSub'] = this.valueFormControl.valueChanges
            .pipe(debounceTime(100))
            .subscribe((value) => {

                this.isInvalid.set(this.valueFormControl?.invalid ?? false);

                if (value == 'dropdownreset') {
                    this.valueFormControl?.setValue(null);
                    value = null;
                }

                this.valueChange.emit(value);
            });
    }
}
