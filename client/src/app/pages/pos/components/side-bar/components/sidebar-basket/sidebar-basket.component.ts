import { Component, inject } from '@angular/core';

import { BasketServiceService } from './../../../../../../pages/pos/services/basket-service.service';
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
    private basketService = inject(BasketServiceService);

    public basketItems = this.basketService.basketItems;

}
