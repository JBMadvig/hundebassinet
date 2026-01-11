import { Component, inject } from '@angular/core';

import { BasketService } from '@services/basket.service';
import { UserService } from '@services/user.service';

import { SidebarBasketComponent } from './components/sidebar-basket/sidebar-basket.component';

@Component({
    selector: 'app-sidebar',
    imports: [
        SidebarBasketComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SideBarComponent {
    private userService = inject(UserService);
    private basketService = inject(BasketService);

    public user = this.userService.userData;
    public basketItemsAmount = this.basketService.totalItemsCount;
}
