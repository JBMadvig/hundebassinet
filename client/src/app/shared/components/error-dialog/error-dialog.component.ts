import { Component, inject } from '@angular/core';

import { DialogComponent } from '@components/dialog/dialog.component';
import { ErrorService } from '@services/error.service';

@Component({
    selector: 'app-error-dialog',
    imports: [
        DialogComponent,
    ],
    templateUrl: './error-dialog.component.html',
    styleUrl: './error-dialog.component.css',
})
export class ErrorDialogComponent {
    public errorService = inject(ErrorService);
}
