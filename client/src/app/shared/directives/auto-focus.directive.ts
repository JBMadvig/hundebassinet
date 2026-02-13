import { afterNextRender, booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
    selector: '[appAutoFocus]',
    standalone: true,
})
export class AutofocusDirective {
    private el = inject(ElementRef);

    public appAutoFocus = input(false, { transform: booleanAttribute });

    constructor() {
        afterNextRender(() => {
            if (this.appAutoFocus()) {
                this.el.nativeElement.focus();
            }
        });
    }
}
