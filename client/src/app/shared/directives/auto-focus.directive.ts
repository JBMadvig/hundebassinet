import { Directive, ElementRef, input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appAutoFocus]',
    standalone: true,
})
export class AutofocusDirective implements OnChanges {

    public appAutoFocus = input(false);

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        const { currentValue, previousValue } = changes['appAutoFocus'];

        if(currentValue) {
            this.elementRef.nativeElement.focus();
        }

        if(previousValue) {
            this.elementRef.nativeElement.blur();
        }
    }
}