import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { VirtualKey } from '../types/key.types';

@Component({
    selector: 'app-virtual-keyboard-key',
    imports: [ CommonModule ],
    templateUrl: './virtual-keyboard-key.component.html',
    styleUrl: './virtual-keyboard-key.component.css',
})
export class VirtualKeyboardKeyComponent {
    public keyPressed = output<VirtualKey>();
    public key = input.required<VirtualKey>();

    public isShift = input.required<boolean>();
    public isCapsLock = input.required<boolean>();

    public handleKeyPress() {
        this.keyPressed.emit(this.key());
    }

}
