import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { DropdownOption } from '@components/input/dropdown/dropdown.component';
import { environment } from '@environment';

export interface CurrencyLocaleInfo {
    currency: string;
    locale: string;
    name: string;
}

const CURRENCY_LOCALE_MAP: Record<string, CurrencyLocaleInfo> = {
    AUD: { currency: 'AUD', locale: 'en-AU', name: 'Australian Dollar' },
    BRL: { currency: 'BRL', locale: 'pt-BR', name: 'Brazilian Real' },
    CAD: { currency: 'CAD', locale: 'en-CA', name: 'Canadian Dollar' },
    CHF: { currency: 'CHF', locale: 'de-CH', name: 'Swiss Franc' },
    CNY: { currency: 'CNY', locale: 'zh-CN', name: 'Chinese Renminbi Yuan' },
    CZK: { currency: 'CZK', locale: 'cs-CZ', name: 'Czech Koruna' },
    DKK: { currency: 'DKK', locale: 'da-DK', name: 'Danish Krone' },
    EUR: { currency: 'EUR', locale: 'de-DE', name: 'Euro' },
    GBP: { currency: 'GBP', locale: 'en-GB', name: 'British Pound' },
    HKD: { currency: 'HKD', locale: 'zh-HK', name: 'Hong Kong Dollar' },
    HUF: { currency: 'HUF', locale: 'hu-HU', name: 'Hungarian Forint' },
    IDR: { currency: 'IDR', locale: 'id-ID', name: 'Indonesian Rupiah' },
    ILS: { currency: 'ILS', locale: 'he-IL', name: 'Israeli New Shekel' },
    INR: { currency: 'INR', locale: 'hi-IN', name: 'Indian Rupee' },
    ISK: { currency: 'ISK', locale: 'is-IS', name: 'Icelandic Króna' },
    JPY: { currency: 'JPY', locale: 'ja-JP', name: 'Japanese Yen' },
    KRW: { currency: 'KRW', locale: 'ko-KR', name: 'South Korean Won' },
    MXN: { currency: 'MXN', locale: 'es-MX', name: 'Mexican Peso' },
    MYR: { currency: 'MYR', locale: 'ms-MY', name: 'Malaysian Ringgit' },
    NOK: { currency: 'NOK', locale: 'nb-NO', name: 'Norwegian Krone' },
    NZD: { currency: 'NZD', locale: 'en-NZ', name: 'New Zealand Dollar' },
    PHP: { currency: 'PHP', locale: 'fil-PH', name: 'Philippine Peso' },
    PLN: { currency: 'PLN', locale: 'pl-PL', name: 'Polish Złoty' },
    RON: { currency: 'RON', locale: 'ro-RO', name: 'Romanian Leu' },
    SEK: { currency: 'SEK', locale: 'sv-SE', name: 'Swedish Krona' },
    SGD: { currency: 'SGD', locale: 'en-SG', name: 'Singapore Dollar' },
    THB: { currency: 'THB', locale: 'th-TH', name: 'Thai Baht' },
    TRY: { currency: 'TRY', locale: 'tr-TR', name: 'Turkish Lira' },
    USD: { currency: 'USD', locale: 'en-US', name: 'United States Dollar' },
    ZAR: { currency: 'ZAR', locale: 'en-ZA', name: 'South African Rand' },
};

export const currencyDropdownOptions: DropdownOption<string>[] = Object.values(CURRENCY_LOCALE_MAP).map(
    ({ currency, name }) => ({ text: `${name} (${currency})`, value: currency }),
);

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/currency`;

    // fetch possible currencies from the server
    public getCurrencyOptions(): Promise<string[]> {
        return firstValueFrom(
            this.http.get<string[]>(`${this.apiUrl}/get-currencies`),
        );
    }

    public getLocaleFromCurrency(currency: string): CurrencyLocaleInfo {
        return CURRENCY_LOCALE_MAP[currency] ?? CURRENCY_LOCALE_MAP['DKK'];
    }
}
