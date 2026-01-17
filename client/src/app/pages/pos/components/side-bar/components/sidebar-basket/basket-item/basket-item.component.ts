import { Component, computed, ElementRef, HostListener, inject, input, signal, viewChild } from '@angular/core';

import { CounterComponent } from '@components/counter/counter.component';
import { BasketService } from '@services/basket.service';

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

    public basketService = inject(BasketService);

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
}
