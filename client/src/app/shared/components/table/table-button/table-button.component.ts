import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-table-button',
    imports: [
        CommonModule,
    ],
    templateUrl: './table-button.component.html',
    styleUrl: './table-button.component.css',
})
export class TableButtonComponent {

    /**
     * The label of the table button.
     */
    public label = input.required<string>();

    /**
     * The `textOrientation` input is the position of the text.
     * - `'left'` - The text will be placed to the left.
     * - `'right'` - The text will be placed to the right.
     * - `'center'` (default) - The text will be placed in the center.
     */
    public textOrientation = input<'right' | 'left' |'center'>('center');

    /**
     * The active input indicates whether the table is sorted by this button or not and adds an icon (FontAwesome 'fa-solid fa-sort' class).
     */
    public active = input<boolean>(false);

    /**
     * The `sortDir` input is the direction of the sort and changes the icon for the sort
     * - `'DESC'` - Adds 'fa-flip-vertical' class to the icon
     * - `'ASC'` - Actually does nothing since the base icon already is the 'ASC' direction. :-)
     */
    public sortDir = input<'ASC' | 'DESC'>();

    /**
     * Loading input indicates whether the button is loading or not.
     */
    public loading = input<boolean>();

    public handleClick = output();

    onClick() {
        this.handleClick.emit();
    }

}
