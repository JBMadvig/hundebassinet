import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { BadgeComponent } from '@components/badge/badge.component';
import { LocaleCurrencyPipe } from '@pipes/locale-currency.pipe';
import { AuthService } from '@services/auth.service';
import { BasketService } from '@services/basket.service';
import { CurrencyService } from '@services/currency.service';

import { Item } from '../../../../../shared/types/items.types';
import { ItemTypeHeaderComponent } from './item-type-header/item-type-header.component';

@Component({
    selector: 'app-item',
    imports: [
        CommonModule,
        ItemTypeHeaderComponent,
        BadgeComponent,
        LocaleCurrencyPipe,
    ],
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
})
export class ItemComponent {
    private authService = inject(AuthService);
    private currencyService = inject(CurrencyService);
    public basketService = inject(BasketService);

    public currentUser = this.authService.currentUser;

    public item = input.required<Item>();

    public currencyInfo = computed(() => {
        const code = this.currentUser()?.currency ?? 'DKK';
        return this.currencyService.getLocaleFromCurrency(code);
    });
}
