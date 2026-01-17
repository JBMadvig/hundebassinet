import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { BasketService } from '@services/basket.service';
import { UserService } from '@services/user.service';

import { BasketItemComponent } from './basket-item/basket-item.component';

@Component({
    selector: 'app-sidebar-basket',
    imports: [
        BasketItemComponent,
        CommonModule,
    ],
    templateUrl: './sidebar-basket.component.html',
    styleUrl: './sidebar-basket.component.css',
})
export class SidebarBasketComponent {
    private userService = inject(UserService);
    public basketService = inject(BasketService);

    public basketItems = this.basketService.basketItems;
    public basketItemsAmount = this.basketService.totalItemsCount;
    public totalPrice = this.basketService.totalItemsPrice;
    public user = this.userService.userData;


}
