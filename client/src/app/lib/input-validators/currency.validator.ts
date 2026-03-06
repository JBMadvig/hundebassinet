import { AbstractControl, ValidationErrors } from '@angular/forms';

import { currencyDropdownOptions } from '@services/currency.service';

const validCurrencies = new Set(currencyDropdownOptions.map(option => option.value));

export const currencyValidator = () => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;

        if (!validCurrencies.has(value)) {
            return { currency: true };
        }

        return null;
    };
};
