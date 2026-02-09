import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ErrorDialogComponent } from '@components/error-dialog/error-dialog.component';

@Component({
    selector: 'app-root',
    imports: [
        ErrorDialogComponent,
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    constructor() {}
}
