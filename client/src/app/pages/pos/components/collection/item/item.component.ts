import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { Item } from '../../../../../shared/types/items.types';
import { BasketServiceService } from './../../../../../pages/pos/services/basket-service.service';
import { ItemTypeHeaderComponent } from './item-type-header/item-type-header.component';

@Component({
    selector: 'app-item',
    imports: [
        CommonModule,
        ItemTypeHeaderComponent,
        BadgeComponent,
    ],
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
})
export class ItemComponent {
    public basketService = inject(BasketServiceService);

    public item = input.required<Item>();
}
