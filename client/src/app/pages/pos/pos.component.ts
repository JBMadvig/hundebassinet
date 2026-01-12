import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { BasketService } from '@services/basket.service';
import { CollectionService } from '@services/collection.service';

import { CollectionComponent } from './components/collection/collection.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { SidebarUserDetailsComponent } from './components/side-bar/components/sidebar-user-details/sidebar-user-details.component';
import { SideBarComponent } from './components/side-bar/sidebar.component';

@Component({
    selector: 'app-pos',
    imports: [
        CollectionComponent,
        CommonModule,
        FilterBarComponent,
        SideBarComponent,
        SidebarUserDetailsComponent,
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
export class PosComponent {
    public collectionService = inject(CollectionService);
    public basketService = inject(BasketService);

    public isItemsInBasket = computed(() => {
        return this.basketService.basketItems().length > 0;
    });

}
