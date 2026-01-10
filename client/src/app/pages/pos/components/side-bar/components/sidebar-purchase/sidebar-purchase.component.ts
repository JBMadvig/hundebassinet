import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { BasketService } from '@services/basket.service';

@Component({
    selector: 'app-sidebar-purchase',
    imports: [
        CommonModule,
    ],
    templateUrl: './sidebar-purchase.component.html',
    styleUrl: './sidebar-purchase.component.css',
})
export class SidebarPurchaseComponent {
    private basketService = inject(BasketService);

    public currentBalance = input<number>(0);

    public totalPrice = this.basketService.totalItemsPrice;

    public balanceStatusAfterPurchaseComputed = computed(() => {
        const balanceAfterPurchase = this.currentBalance() - this.totalPrice();
        return balanceAfterPurchase >= 0 ? 'bg-green-600' : 'bg-red-600';
    });

}
