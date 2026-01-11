import { Component } from '@angular/core';

import { CollectionComponent } from './components/collection/collection.component';
import { SidebarUserDetailsComponent } from './components/side-bar/components/sidebar-user-details/sidebar-user-details.component';
import { SideBarComponent } from './components/side-bar/sidebar.component';

@Component({
    selector: 'app-pos',
    imports: [
        SideBarComponent,
        CollectionComponent,
        SidebarUserDetailsComponent,
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
export class PosComponent {

}
