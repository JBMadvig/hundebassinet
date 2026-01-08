import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { BadgeComponent } from '@components/badge/badge.component';
import { BasketService } from '@services/basket.service';

import { Item } from '../../../../../shared/types/items.types';
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
    public basketService = inject(BasketService);

    public item = input.required<Item>();
}
