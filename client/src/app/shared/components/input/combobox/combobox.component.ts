import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
    OnInit,
    output,
    signal,
    TemplateRef,
    viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormControlName, FormGroup, FormGroupDirective, FormsModule, Validators } from '@angular/forms';
import { map, skip } from 'rxjs';

import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { AutofocusDirective } from '@directives/auto-focus.directive';
import { generateId } from '@lib/utils';

export type ComboboxData<T> = {$implicit: T, index: string};

@Component({
    selector: 'app-combobox',
    imports: [
        AutofocusDirective,
        CommonModule,
        FormsModule,
    ],
    templateUrl: './combobox.component.html',
    styleUrl: './combobox.component.css',
})
@AutoUnsubscribe()
export class ComboboxComponent <T extends {id: string, name: string}> implements OnInit {

    private formGroupDirective = inject(FormGroupDirective);
    private formControlNameDirective = inject(FormControlName);

    public searchContainerRef = viewChild<ElementRef<HTMLDivElement>>('searchContainer');

    /**
     * The data supplied to the template.
     */
    public data = input.required<T[]>();

    /**
     * The icon of the search/input field.
     * This is the icon that is displayed inside the search/input field.
     *
     * It should be given as a font-awesome icon class.
     */
    public icon = input<string | null>(null);

    /**
     *  Changes the input field to a error state so you can show an error visually
     *  This might be removed later, we are looing into a better way to handle this.
     */
    public invalid = input(false);

    /**
     * The label of the input field.
     * This is the text that is displayed above the combobox field.
     */
    public label = input<string>('');

    /**
     * Whether the input field should autofocus or not.
     * If true, the input field will be focused when the component is loaded.
    */
    public autofocus = input(false, { transform: booleanAttribute });

    /**
     * The loading state when searching.
     * Sinc the search is done outside, we'll have a signal as input that changes depending on the loading state.
     */
    public loading = input<boolean>(false);

    /**
    * The placeholder of the search/input field.
    * This is the text that is displayed when the search/input field is empty.
    */
    public placeholder = input<string>('');


    /**
     * The initial value of the search/input field.
     * This is the value that is displayed when the component is first loaded
     * and the ID of which is returned when the form is submitted when no search has been done.
     */
    public initialValue = input<T | null>(null);

    /**
     * This is the text that is displayed in the search/input field.
     */
    public inputValue = signal<string>('');

    /**
     * If a selected value is set, this will be the current value.
     */
    public currentValue = signal<string>('');

    public inputValueChange = output<string>();
    public selectedRowValue = output<T>();
    public selectedEmptyTemplate = output<void>();

    public isFocused = signal(false);
    public isRequired = signal(false);

    public controlId = generateId(10);

    public valueFormGroup?: FormGroup;
    public valueFormControl?: FormControl;

    public optionsTemplateRef = contentChild<TemplateRef<ComboboxData<T>>>('optionsTemplate');
    public optionsTemplate = computed(() => this.optionsTemplateRef() ?? null);

    public emptyTemplateRef = contentChild<TemplateRef<void>>('emptyTemplate');
    public emptyTemplate = computed(() => this.emptyTemplateRef() ?? null);

    public internalLoading = linkedSignal(() => {
        this.data();
        return this.loading();
    });

    // This will be false until the data is changed from the initial value.
    public initialized = toSignal(toObservable(this.data).pipe(
        skip(1),
        map(() => true),
    ), { initialValue: false });

    private inputValueEffect = effect(() => {
        this.inputValueChange.emit(this.inputValue());
    });

    public dropdownWidth = computed(() => {
        const input = this.searchContainerRef()?.nativeElement;
        if (!input) return 'auto';
        const width = input.offsetWidth;
        return `${width}px`;
    });

    ngOnInit() {
        this.valueFormGroup = this.formGroupDirective.form;
        this.valueFormControl = this.formGroupDirective.getControl(this.formControlNameDirective);
        this.isRequired.set(this.valueFormControl.hasValidator(Validators.required));

        const initialValue = this.initialValue();
        if (initialValue) {
            this.valueFormControl.setValue(initialValue.id);
            this.inputValue.set(initialValue.name);
            this.currentValue.set(initialValue.name);
        }

        AutoSub(this).reg['valueChange'] = this.valueFormControl?.valueChanges.subscribe(() => {
            this.internalLoading.set(true);
        });
    }

    public onFocus() {
        this.isFocused.set(true);
    }

    public onBlur() {
        this.isFocused.set(false);
        this.inputValue.set(this.currentValue());
    }

    public onInputFieldClick() {
        const control = this.valueFormControl;
        if (!control) return;
        this.inputValue.set('');
    }

    public onSelectRow(newValue: T, event: MouseEvent): void {
        event.stopPropagation();
        const control = this.valueFormControl;
        if (!control) return;
        control.setValue(newValue.id);
        this.inputValue.set(newValue.name);
        this.currentValue.set(newValue.name);
        this.selectedRowValue.emit(newValue);
    }

    public onSelectEmptyTemplate(event: MouseEvent): void {
        event.stopPropagation();
        const control = this.valueFormControl;
        if (!control) return;
        this.selectedEmptyTemplate.emit();
    }

    public onReset(event: MouseEvent) {
        event.stopPropagation();
        const control = this.valueFormControl;
        if (!control) return;
        control.setValue(null);
        this.inputValue.set('');
        this.currentValue.set('');
    }

    public formReset() {
        this.inputValue.set('');
        this.currentValue.set('');
    }
}
