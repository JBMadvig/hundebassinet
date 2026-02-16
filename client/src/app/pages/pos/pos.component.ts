import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { InputFieldComponent } from '@components/input/input-field/input-field.component';
import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { BasketService } from '@services/basket.service';
import { CollectionService } from '@services/collection.service';

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
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
@AutoUnsubscribe()
export class PosComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    public collectionService = inject(CollectionService);
    public basketService = inject(BasketService);

    public userId = signal<string | null>(null);
    public openSettings = signal(false);

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
        console.log('POS Component loaded for user ID:', userIdParam);
    }

    public isItemsInBasket = computed(() => {
        return this.basketService.basketItems().length > 0;
    });

}
