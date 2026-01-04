import { Component } from '@angular/core';

import { CollectionComponent } from './components/collection/collection.component';
import { SideBarComponent } from './components/side-bar/sidebar.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';

@Component({
    selector: 'app-pos',
    imports: [
        TopMenuComponent,
        SideBarComponent,
        CollectionComponent,
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
export class PosComponent {

}
