import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'app/shared/types/items.types';

import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { BasketService } from '@services/basket.service';
import { CollectionService } from '@services/collection.service';
import { WebSocketService } from '@services/websocket.service';

import { AddItemComponent } from '../inventory/add-item/add-item.component';
import { CollectionComponent } from './components/collection/collection.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SidebarUserDetailsComponent } from './components/side-bar/components/sidebar-user-details/sidebar-user-details.component';
import { SideBarComponent } from './components/side-bar/sidebar.component';

@Component({
    selector: 'app-pos',
    imports: [
        CollectionComponent,
        CommonModule,
        FilterBarComponent,
        InputFieldComponent,
        ReactiveFormsModule,
        SettingsComponent,
        SideBarComponent,
        SidebarUserDetailsComponent,
        AddItemComponent,
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
@AutoUnsubscribe()
export class PosComponent implements OnInit {
    public basketService = inject(BasketService);
    public collectionService = inject(CollectionService);
    private formBuilder = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private wsService = inject(WebSocketService);

    public userId = signal<string | null>(null);
    public openSettings = signal(false);
    public showItemsAddDialog = signal(false);
    public scanToast = signal<string | null>(null);

    public searchForm = this.formBuilder.group({
        search: '',
    });

    constructor() {
        AutoSub(this).reg['searchFormSub'] = this.searchForm.controls.search.valueChanges.subscribe(() => {
            this.collectionService.searchQuery.set(this.searchForm.controls.search.value || '');
        });
    }

    ngOnInit() {
        const userIdParam = this.route.snapshot.paramMap.get('userId');
        this.userId.set(userIdParam);

        if (userIdParam) {
            this.wsService.connect();
            this.wsService.subscribe(`pos:${userIdParam}`);

            // TODO: Make sure this is handled correctly
            AutoSub(this).reg['scanSub'] = this.wsService.messages$.subscribe((msg) => {
                if (msg['type'] === 'item-scanned') {
                    const item = msg['item'] as Item;
                    this.basketService.addItemToBasket(item);
                    this.showScanToast(`Added: ${item.name}`);
                }
            });
        }
    }

    private showScanToast(message: string) {
        this.scanToast.set(message);
        setTimeout(() => this.scanToast.set(null), 3000);
    }

    public isItemsInBasket = computed(() => {
        return this.basketService.basketItems().length > 0;
    });

}
