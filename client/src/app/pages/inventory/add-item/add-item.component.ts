import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateItemRequest, InventoryRequest, Item, PrimaryCategoriesType, PrimaryCategoriesTypeValues } from 'app/shared/types/items.types';
import { isNonNull } from 'app/shared/utils';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { filter } from 'rxjs/internal/operators/filter';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { ComboboxComponent, ComboboxData } from '@components/input/combobox/combobox.component';
import { DropdownComponent } from '@components/input/dropdown/dropdown.component';
import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { TypedTemplateDirective } from '@directives/typed-template.directive';
import { currencyValidator } from '@lib/input-validators/currency.validator';
import { LocaleCurrencyPipe } from '@pipes/locale-currency.pipe';
import { AuthService } from '@services/auth.service';
import { currencyDropdownOptions, CurrencyService } from '@services/currency.service';
import { InventoryService } from '@services/inventory.service';

@Component({
    selector: 'app-add-item',
    imports: [
        ComboboxComponent,
        CommonModule,
        DialogComponent,
        ReactiveFormsModule,
        TypedTemplateDirective,
        InputFieldComponent,
        DropdownComponent,
        ButtonComponent,
        LocaleCurrencyPipe,
    ],
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css',
})
export class AddItemComponent {
    private authService = inject(AuthService);
    private currencyService = inject(CurrencyService);
    private formBuilder = inject(FormBuilder);
    private inventoryService = inject(InventoryService);

    public itemComboboxType!: ComboboxData<Item>;

    private currentUser = this.authService.currentUser;
    public readonly primaryCategoryOptionsValues = PrimaryCategoriesTypeValues;
    public readonly currencyOptions = currencyDropdownOptions;

    public itemSearchResource = resource({
        defaultValue: [],
        params: () => this.searchValueChangeSignal() || '',
        loader: async ({ params: searchQuery }) => {
            if (!searchQuery) {
                return [];
            }

            const body: InventoryRequest = {
                searchQuery: searchQuery,
                sortBy: 'name',
                sortDirection: 'ascending',
                page: 1,
                entriesPrPage: 25,
            };

            const response = await this.inventoryService.searchInventoryItems(body);

            return response.items;
        },
    });

    public searchItemsForm = this.formBuilder.group({
        search: [ '' ],
        itemChosen: [ false ],
    });

    public itemForm = this.formBuilder.group({
        itemId: [ '' ],
        itemExists: [ false ],
        name: [ '', [ Validators.required ] ],
        primaryCategory: [ '' as PrimaryCategoriesType, [ Validators.required ] ],
        secondaryCategory: [ '' ],
        abv: 0,
        volume: [ 0, [ Validators.required, Validators.min(1) ] ],
        price: [ 0, [ Validators.required, Validators.min(1) ] ],
        currency: [ 'DKK', [ Validators.required, currencyValidator() ] ],
        units: [ 0, [ Validators.required, Validators.min(1) ] ],
    });

    public visible = model(false);

    private selectedItemVolume = signal<number | null>(null);

    public searchValueChangeSignal = toSignal(this.searchItemsForm.controls.search.valueChanges.pipe(
        debounceTime(500),
        filter(isNonNull),
    ),
    { initialValue: '' },
    );
    public itemChosenSignal = toSignal(this.searchItemsForm.controls.itemChosen.valueChanges);
    public itemExistsSignal = toSignal(this.itemForm.controls.itemExists.valueChanges);
    public currencyInfo = this.authService.currencyInfo;

    private priceSignal = toSignal(this.itemForm.controls.price.valueChanges);
    private unitsSignal = toSignal(this.itemForm.controls.units.valueChanges);

    public pricePerUnit = computed(() => {
        const price = this.priceSignal() ?? 0;
        const units = this.unitsSignal() ?? 0;
        if (price > 0 && units > 0) {
            return price / units;
        }
        return null;
    });

    public primaryCategoryOptions = computed(() => {
        return PrimaryCategoriesTypeValues.map(category => ({ text: category.charAt(0).toUpperCase() + category.slice(1), value: category }));
    });

    constructor() {
        effect(() => {
            const itemExists = this.itemExistsSignal();
            const controls = this.itemForm.controls;
            const fieldsToToggle = [ controls.name, controls.primaryCategory, controls.secondaryCategory, controls.abv ];

            for (const control of fieldsToToggle) {
                if (itemExists) {
                    control.disable();
                } else {
                    control.enable();
                }
            }
        });
    }

    public setItemValues(item: Item) {
        console.log('🚀 ~ AddItemComponent ~ setItemValues ~ item:', item);
        this.searchItemsForm.patchValue({
            itemChosen: true,
        });
        this.selectedItemVolume.set(item.volume);

        const currentUserCurrency = this.currentUser()?.currency || 'DKK';
        this.itemForm.patchValue({
            itemId: item.id,
            itemExists: true,
            name: item.name,
            primaryCategory: item.primaryCategory,
            secondaryCategory: item.secondaryCategory,
            abv: item.abv,
            volume: item.volume,
            currency: currentUserCurrency,
        });
    }

    public setNewItemValues() {
        const searchValue = this.searchItemsForm.controls.search.value;
        this.searchItemsForm.patchValue({
            itemChosen: true,
        });
        this.selectedItemVolume.set(null);

        const currentUserCurrency = this.currentUser()?.currency || 'DKK';

        this.itemForm.patchValue({
            itemExists: false,
            name: searchValue,
            primaryCategory: 'other',
            secondaryCategory: '',
            abv: 0,
            currency: currentUserCurrency,
        });
    }

    public clearItemForm() {
        this.selectedItemVolume.set(null);
        this.itemForm.reset();
    }

    public async confirmAddToInventory() {
        if (this.itemForm.invalid) {
            this.itemForm.markAllAsTouched();
            return;
        }

        const controls = this.itemForm.controls;
        const originalVolume = this.selectedItemVolume();

        // If user changed the volume from the selected item, treat as a new item variant
        if (controls.itemExists.value === true && controls.volume.value !== originalVolume) {
            controls.itemId.setValue('');
            controls.itemExists.setValue(false);
        }

        const itemBody: CreateItemRequest = {
            name: controls.name.value!,
            primaryCategory: controls.primaryCategory.value!,
            secondaryCategory: controls.secondaryCategory.value!,
            abv: controls.abv.value!,
            volume: controls.volume.value!,
            price: controls.price.value!,
            amount: controls.units.value!,
            currency: controls.currency.value!,
        };

        const itemId = controls.itemId.value;

        if (!itemId) {
            try {
                const resp = await this.inventoryService.createItem(itemBody);
                console.log('Item created successfully:', resp);
            } catch (error) {
                console.error('Error creating item:', error);
            }
        } else {
            console.log('Updating existing item: ', itemBody, ', with id:', itemId);
        }
    }
}
