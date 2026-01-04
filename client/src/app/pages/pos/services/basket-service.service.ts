import { computed, Injectable, signal } from '@angular/core';

import { Item, ItemWithQuantity } from './../../../shared/types/items.types';

@Injectable({
    providedIn: 'root',
})
export class BasketServiceService {

    public basketItems = signal<ItemWithQuantity[]> ([]);

    public totalItemsCount = computed(() => {
        return this.basketItems().reduce((total, item) => total + item.quantity, 0);
    });

    public totalItemsPrice = computed(() => {
        return this.basketItems().reduce((total, item) => total + ( item.averagePrice * item.quantity ), 0);
    });

    public addItemToBasket(item: Item | ItemWithQuantity) {
        this.basketItems.update((items) => {
            const existingItem = items.find((i) => i.id === item.id);
            if (existingItem) {
                return items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
                );
            } else {
                return [ ...items, { ...item, quantity: 1 } ];
            }
        });
    }

    public removeSingleItemFromBasket(item: Item | ItemWithQuantity) {
        this.basketItems.update((items) => {
            const existingItem = items.find((i) => i.id === item.id);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    return items.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
                    );
                } else {
                    return items.filter((i) => i.id !== item.id);
                }
            }
            return items;
        });
    }

    public removeItemCompletelyFromBasket(item: Item | ItemWithQuantity) {
        this.basketItems.update((items) => {
            return items.filter((i) => i.id !== item.id);
        });
    }

    public clearBasket() {
        this.basketItems.set([]);
    }

}
