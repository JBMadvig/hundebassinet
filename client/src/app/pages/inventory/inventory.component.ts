import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, resource, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryRequest, Item, ItemSortValues, SortDirection } from 'app/shared/types/items.types';

import { ButtonComponent } from '@components/button/button.component';
import { TableComponent } from '@components/table/table.component';
import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { AuthService } from '@services/auth.service';
import { InventoryService } from '@services/inventory.service';
import { WebSocketService } from '@services/websocket.service';

import { AddItemComponent } from './add-item/add-item.component';

@Component({
    selector: 'app-inventory',
    imports: [
        AddItemComponent,
        ButtonComponent,
        CommonModule,
        TableComponent,
    ],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.css',
})
@AutoUnsubscribe()
export class InventoryComponent implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private inventoryService = inject(InventoryService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private wsService = inject(WebSocketService);

    private addItemComp = viewChild(AddItemComponent);

    private readonly currentUser = this.authService.currentUser;

    public searchForm = this.formBuilder.group({
        searchQuery: '',
        sortBy: 'name' as ItemSortValues,
        sortDirection: 'ascending' as SortDirection,
        page: [ 1, [ Validators.min(1) ] ],
        entriesPrPage: [ 25, [ Validators.min(25), Validators.max(100) ] ],
    });

    public inventoryResource = resource({
        defaultValue: [],
        loader: async () => {
            const currentUser = this.currentUser()?.role;

            if (!currentUser) {
                return [];
            }

            const searchQuery = this.searchValueChangeSignal() || '';
            const sortBy = this.sortByValueChangeSignal() || 'name';
            const sortDirection = this.sortDirectionValueChangeSignal() || 'ascending';
            const page = this.pageValueChangeSignal() || 1;
            const entriesPrPage = this.entriesPrPageValueChangeSignal() || 25;

            const body: InventoryRequest = {
                searchQuery,
                sortBy,
                sortDirection,
                page,
                entriesPrPage,
            };

            const response = await this.inventoryService.searchInventoryItems(body);
            console.log('🚀 ~ InventoryComponent ~ response:', response);
            return response.items;

        },
    });

    public addItemsToInvetory = signal(false);

    // Form valueChange signal converters to trigger the resource API
    public searchValueChangeSignal = toSignal(this.searchForm.controls.searchQuery.valueChanges);
    public sortByValueChangeSignal = toSignal(this.searchForm.controls.sortBy.valueChanges);
    public sortDirectionValueChangeSignal = toSignal(this.searchForm.controls.sortDirection.valueChanges);
    public pageValueChangeSignal = toSignal(this.searchForm.controls.page.valueChanges);
    public entriesPrPageValueChangeSignal = toSignal(this.searchForm.controls.entriesPrPage.valueChanges);

    ngOnInit() {
        const userId = this.authService.currentUser()?.id;
        if (userId) {
            this.wsService.connect();
            this.wsService.subscribe(`pos:${userId}`);
            // TODO: Make sure this is handled correctly
            AutoSub(this).reg['scanSub'] = this.wsService.messages$.subscribe((msg) => {
                if (msg['type'] === 'item-scanned') {
                    const item = msg['item'] as Item;
                    this.addItemsToInvetory.set(true);
                    setTimeout(() => this.addItemComp()?.setItemValues(item), 0);
                }
            });
        }
    }

    ngOnDestroy() {
        const userId = this.authService.currentUser()?.id;
        if (userId) {
            this.wsService.unsubscribe(`pos:${userId}`);
        }
    }

    public goBackToPos() {
        this.router.navigate([ '/pos' ]);
    }

}
