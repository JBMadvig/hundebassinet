import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, input, model, output, viewChild } from '@angular/core';

@Component({
    selector: 'app-dialog',
    imports: [
        CommonModule,
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
})
export class DialogComponent {
    private dialog = viewChild<ElementRef>('dialog');

    /**
     * To display an icon left to the modal title
     *  Pass font-awesome icon class name(s)
     */
    public icon = input<string | null>(null);

    /**
     * The title of the dialog.
     */
    public dialogTitle = input<string | null>(null);

    /**
     * Whether the dialog is visible or not.
     */
    public visible = model.required<boolean>();

    /**
     *  Allow the dialog to be closed by clicking outside of it.
     */
    public allowCloseOutside = input(true);

    /**
     * The theme of the dialog.
     * TODO: Make the themes actually do something.
     */
    public theme = input<'light' | 'dark'>('light');

    /**
     * Emits when close event is triggered.
     * It is up to the user to set the visible property to false.
     */
    public closeDialog = output();

    @HostListener('document:keydown.escape', [ '$event' ])
    public onKeydownHandler(event: Event) {
        if (!event || !this.visible()) return;
        this.onHandleClose();
    }

    public clickOutside(n: KeyboardEvent | MouseEvent) {
        console.log('🚀 ~ DialogComponent ~ clickOutside ~ n:', n);
        const dialog = this.dialog();
        if (!dialog || !this.allowCloseOutside) return;
        if (n instanceof KeyboardEvent) return;

        // If the click was outside of the dialog, close it.
        if (!dialog.nativeElement.contains(n.target)) {
            console.log('🚀 ~ DialogComponent ~ clickOutside ~ ', n);
            this.onHandleClose();
        }
    }

    public onHandleClose() {
        this.closeDialog.emit();
        this.visible.set(false);
    }
}
