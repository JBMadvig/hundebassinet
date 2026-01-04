import { Component } from '@angular/core';

import { mockUsers } from '../../testdata';
import { SidebarBasketComponent } from './components/sidebar-basket/sidebar-basket.component';
import { SidebarUserDetailsComponent } from './components/sidebar-user-details/sidebar-user-details.component';

@Component({
    selector: 'app-sidebar',
    imports: [
        SidebarUserDetailsComponent,
        SidebarBasketComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SideBarComponent {

    public user = mockUsers[0];
}
