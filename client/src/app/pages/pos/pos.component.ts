import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { InputFieldComponent } from '@components/input-field/input-field.component';
import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
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
        InputFieldComponent,
        ReactiveFormsModule,
        SideBarComponent,
        SidebarUserDetailsComponent,
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
@AutoUnsubscribe()
export class PosComponent {
    private formBuilder = inject(FormBuilder);
    public collectionService = inject(CollectionService);
    public basketService = inject(BasketService);

    public searchForm = this.formBuilder.group({
        search: '',
    });

    constructor() {
        AutoSub(this).reg['searchFormSub'] = this.searchForm.controls.search.valueChanges.subscribe(() => {
            this.collectionService.searchQuery.set(this.searchForm.controls.search.value || '');
        });

    }

    public isItemsInBasket = computed(() => {
        return this.basketService.basketItems().length > 0;
    });

}
