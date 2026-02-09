import { booleanAttribute, Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
    selector: '[appAutoFocus]',
    standalone: true,
})
export class AutofocusDirective {
    private el = inject(ElementRef);

    public appAutoFocus = input(false, { transform: booleanAttribute });

    constructor() {
        effect(() => {
            if (this.appAutoFocus()) {
                this.el.nativeElement.focus();
            } else {
                this.el.nativeElement.blur();
            }
        });
    }
}
