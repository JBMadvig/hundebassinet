import { Component, computed, ElementRef, Host, HostListener, inject, input, signal, viewChild } from '@angular/core';

import { CounterComponent } from '@components/counter/counter.component';

import { BasketServiceService } from './../../../../../../../pages/pos/services/basket-service.service';
import { ItemWithQuantity } from './../../../../../../../shared/types/items.types';

@Component({
    selector: 'app-basket-item',
    imports: [
        CounterComponent,
    ],
    templateUrl: './basket-item.component.html',
    styleUrl: './basket-item.component.css',
})
export class BasketItemComponent {

    public basketService = inject(BasketServiceService);

    private dialogRef = viewChild<ElementRef<HTMLDivElement>>('deleteItemDialog');

    public item = input.required<ItemWithQuantity>();

    public deleteItemDialogOpen = signal(false);

    public collectivePrice = computed(() => {
        return this.item().averagePrice * this.item().quantity;
    });

    @HostListener('document:click', [ '$event' ])
    public onClickOutsideDeleteDialog(event: MouseEvent) {
        const dialogElement = this.dialogRef()?.nativeElement;
        if (this.deleteItemDialogOpen() && dialogElement && !dialogElement.contains(event.target as Node)) {
            this.deleteItemDialogOpen.set(false);
        }
    }

    public clearItemFromBasket(item: ItemWithQuantity) {
        // Remove the item completely from the basket
    }
}
