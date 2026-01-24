import { Component, inject, signal } from '@angular/core';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { BasketService } from '@services/basket.service';
import { UserService } from '@services/user.service';

import { SidebarBasketComponent } from './components/sidebar-basket/sidebar-basket.component';

@Component({
    selector: 'app-sidebar',
    imports: [
        ButtonComponent,
        DialogComponent,
        SidebarBasketComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SideBarComponent {
    private userService = inject(UserService);
    private basketService = inject(BasketService);

    public openPurchaseConfirmationDialog = signal(false);

    public user = this.userService.userData;
    public basketItemsAmount = this.basketService.totalItemsCount;
    public totalPrice = this.basketService.totalItemsPrice;
}
