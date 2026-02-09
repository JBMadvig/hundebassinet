import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { AuthService } from '@services/auth.service';
import { BasketService } from '@services/basket.service';

import { BasketItemComponent } from './basket-item/basket-item.component';

@Component({
    selector: 'app-sidebar-basket',
    imports: [
        BasketItemComponent,
        CommonModule,
        DialogComponent,
        ButtonComponent,
    ],
    templateUrl: './sidebar-basket.component.html',
    styleUrl: './sidebar-basket.component.css',
})
export class SidebarBasketComponent {
    private authService = inject(AuthService);
    public basketService = inject(BasketService);

    public showDialog = signal(false);

    public basketItems = this.basketService.basketItems;
    public basketItemsAmount = this.basketService.totalItemsCount;
    public totalPrice = this.basketService.totalItemsPrice;
    public user = this.authService.currentUser;


}
