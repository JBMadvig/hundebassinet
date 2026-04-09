import { CommonModule } from '@angular/common';
import { afterRenderEffect, booleanAttribute, Component, ElementRef, input, model, output, viewChild } from '@angular/core';

@Component({
    selector: 'app-dialog',
    imports: [
        CommonModule,
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
})
export class DialogComponent {
    private dialogEl = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');

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
     * Whether the dialog should expand to its maximum allowed width.
     */
    public useFullWidth = input(false, { transform: booleanAttribute });

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

    private readonly onClickOutside = (event: MouseEvent) => {
        if (!this.allowCloseOutside()) return;
        if (event.target === this.dialogEl()?.nativeElement) {
            this.onHandleClose();
        }
    };

    constructor() {
        afterRenderEffect(() => {
            const isVisible = this.visible();
            const dialog = this.dialogEl()?.nativeElement;
            if (!dialog) return;

            if (isVisible && !dialog.open) {
                dialog.showModal();
                dialog.addEventListener('mousedown', this.onClickOutside);
            } else if (!isVisible && dialog.open) {
                dialog.removeEventListener('mousedown', this.onClickOutside);
                dialog.close();
            }
        });
    }

    /** Handles the native cancel event (ESC key on modal dialogs). */
    public onCancel(event: Event): void {
        event.preventDefault();
        this.onHandleClose();
    }

    public onHandleClose() {
        this.closeDialog.emit();
        this.visible.set(false);
    }
}
