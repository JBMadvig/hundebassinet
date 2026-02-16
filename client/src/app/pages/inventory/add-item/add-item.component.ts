import { Component, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { InputFieldComponent } from '@components/input/input-field/input-field.component';

@Component({
    selector: 'app-add-item',
    imports: [
        DialogComponent,
        ButtonComponent,
        InputFieldComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css',
})
export class AddItemComponent {
    private formBuilder = inject(FormBuilder);

    public visible = model(false);

}
