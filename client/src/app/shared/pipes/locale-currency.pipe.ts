import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyLocaleInfo } from '@services/currency.service';

@Pipe({
    name: 'localeCurrency',
})
export class LocaleCurrencyPipe implements PipeTransform {
    transform(value: number, currencyInfo: CurrencyLocaleInfo): string {
        const formatted = new Intl.NumberFormat(currencyInfo.locale, {
            minimumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
        return `${formatted} ${currencyInfo.currency}`;
    }
}
