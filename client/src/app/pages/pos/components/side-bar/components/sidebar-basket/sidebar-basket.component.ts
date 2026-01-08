import { Component, inject } from '@angular/core';

import { BasketService } from '@services/basket.service';

import { BasketItemComponent } from './basket-item/basket-item.component';

@Component({
    selector: 'app-sidebar-basket',
    imports: [
        BasketItemComponent,
    ],
    templateUrl: './sidebar-basket.component.html',
    styleUrl: './sidebar-basket.component.css',
})
export class SidebarBasketComponent {
    private basketService = inject(BasketService);

    public basketItems = this.basketService.basketItems;

}
