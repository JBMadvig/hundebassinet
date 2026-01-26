import { Component, effect, inject, output, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { VirtualKey } from './types/key.types';
import { VirtualKeyboardKeyComponent } from './virtual-keyboard-key/virtual-keyboard-key.component';

@Component({
    selector: 'app-virtual-keyboard',
    imports: [
        VirtualKeyboardKeyComponent,
    ],
    templateUrl: './virtual-keyboard.component.html',
    styleUrl: './virtual-keyboard.component.css',
})
export class VirtualKeyboardComponent {
    private formBuilder = inject(FormBuilder);

    public valueChange = output<string>();

    public typedValue = this.formBuilder.group({
        input: '',
    });

    public isShift = signal(false);
    public isCapsLock = signal(false);

    // public virtualKeys: VirtualKey[] = [
    //     // Row 1: Numbers and special characters
    //     { row: 1, value: '1', shift: '!' },
    //     { row: 1, value: '2', shift: '"' },
    //     { row: 1, value: '3', shift: '#' },
    //     { row: 1, value: '4', shift: '¤' },
    //     { row: 1, value: '5', shift: '%' },
    //     { row: 1, value: '6', shift: '&' },
    //     { row: 1, value: '7', shift: '/' },
    //     { row: 1, value: '8', shift: '(' },
    //     { row: 1, value: '9', shift: ')' },
    //     { row: 1, value: '0', shift: '=' },
    //     { row: 1, value: '+', shift: '?' },
    //     { row: 1, value: '´', shift: '`' },
    //     { row: 1, value: 'Backspace' },
    //     // Row 2: QWERTY letters
    //     { row: 2, value: 'Tab' },
    //     { row: 2, value: 'q' },
    //     { row: 2, value: 'w' },
    //     { row: 2, value: 'e' },
    //     { row: 2, value: 'r' },
    //     { row: 2, value: 't' },
    //     { row: 2, value: 'y' },
    //     { row: 2, value: 'u' },
    //     { row: 2, value: 'i' },
    //     { row: 2, value: 'o' },
    //     { row: 2, value: 'p' },
    //     { row: 2, value: 'å' },
    //     { row: 2, value: '¨', shift: '^' },
    //     // Row 3: ASDFGH letters
    //     { row: 3, value: 'CapsLock' },
    //     { row: 3, value: 'a' },
    //     { row: 3, value: 's' },
    //     { row: 3, value: 'd' },
    //     { row: 3, value: 'f' },
    //     { row: 3, value: 'g' },
    //     { row: 3, value: 'h' },
    //     { row: 3, value: 'j' },
    //     { row: 3, value: 'k' },
    //     { row: 3, value: 'l' },
    //     // Nordic characters for row 3
    //     { row: 3, value: 'æ' },
    //     { row: 3, value: 'ø' },
    //     { row: 3, value: "'", shift: '*' },
    //     { row: 3, value: 'Enter' },
    //     // Row 4: ZXCVBN letters
    //     { row: 4, value: 'Shift' },
    //     { row: 4, value: '<', shift: '>' },
    //     { row: 4, value: 'z' },
    //     { row: 4, value: 'x' },
    //     { row: 4, value: 'c' },
    //     { row: 4, value: 'v' },
    //     { row: 4, value: 'b' },
    //     { row: 4, value: 'n' },
    //     { row: 4, value: 'm' },
    //     { row: 4, value: ',', shift: ';' },
    //     { row: 4, value: '.', shift: ':' },
    //     { row: 4, value: '-', shift: '_' },
    //     { row: 4, value: 'Shift' },
    // ];

    public virtualKeysRow1: VirtualKey[] = [
        // Row 1: Numbers and special characters
        { id: 'key-1', row: 1, value: '1', shift: '!' },
        { id: 'key-2', row: 1, value: '2', shift: '"' },
        { id: 'key-3', row: 1, value: '3', shift: '#' },
        { id: 'key-4', row: 1, value: '4', shift: '¤' },
        { id: 'key-5', row: 1, value: '5', shift: '%' },
        { id: 'key-6', row: 1, value: '6', shift: '&' },
        { id: 'key-7', row: 1, value: '7', shift: '/' },
        { id: 'key-8', row: 1, value: '8', shift: '(' },
        { id: 'key-9', row: 1, value: '9', shift: ')' },
        { id: 'key-10', row: 1, value: '0', shift: '=' },
        { id: 'key-11', row: 1, value: '+', shift: '?' },
        { id: 'key-12', row: 1, value: '´', shift: '`' },
        { id: 'key-13', row: 1, value: 'Backspace' },
    ];

    public virtualKeysRow2: VirtualKey[] = [
        // Row 2: QWERTY letters
        { id: 'key-14', row: 2, value: 'Tab' },
        { id: 'key-15', row: 2, value: 'q' },
        { id: 'key-16', row: 2, value: 'w' },
        { id: 'key-17', row: 2, value: 'e' },
        { id: 'key-18', row: 2, value: 'r' },
        { id: 'key-19', row: 2, value: 't' },
        { id: 'key-20', row: 2, value: 'y' },
        { id: 'key-21', row: 2, value: 'u' },
        { id: 'key-22', row: 2, value: 'i' },
        { id: 'key-23', row: 2, value: 'o' },
        { id: 'key-24', row: 2, value: 'p' },
        { id: 'key-25', row: 2, value: 'å' },
        { id: 'key-26', row: 2, value: '¨', shift: '^' },
    ];

    public virtualKeysRow3: VirtualKey[] = [
        // Row 3: ASDFGH letters
        { id: 'key-27', row: 3, value: 'CapsLock' },
        { id: 'key-28', row: 3, value: 'a' },
        { id: 'key-29', row: 3, value: 's' },
        { id: 'key-30', row: 3, value: 'd' },
        { id: 'key-31', row: 3, value: 'f' },
        { id: 'key-32', row: 3, value: 'g' },
        { id: 'key-33', row: 3, value: 'h' },
        { id: 'key-34', row: 3, value: 'j' },
        { id: 'key-35', row: 3, value: 'k' },
        { id: 'key-36', row: 3, value: 'l' },
        // Nordic characters for row 3
        { id: 'key-37', row: 3, value: 'æ' },
        { id: 'key-38', row: 3, value: 'ø' },
        { id: 'key-39', row: 3, value: "'", shift: '*' },
        { id: 'key-40', row: 3, value: 'Enter' },
    ];
    public virtualKeysRow4: VirtualKey[] = [
        // Row 4: ZXCVBN letters
        { id: 'key-41', row: 4, value: 'Shift' },
        { id: 'key-42', row: 4, value: '<', shift: '>' },
        { id: 'key-43', row: 4, value: 'z' },
        { id: 'key-44', row: 4, value: 'x' },
        { id: 'key-45', row: 4, value: 'c' },
        { id: 'key-46', row: 4, value: 'v' },
        { id: 'key-47', row: 4, value: 'b' },
        { id: 'key-48', row: 4, value: 'n' },
        { id: 'key-49', row: 4, value: 'm' },
        { id: 'key-50', row: 4, value: ',', shift: ';' },
        { id: 'key-51', row: 4, value: '.', shift: ':' },
        { id: 'key-52', row: 4, value: '-', shift: '_' },
        { id: 'key-53', row: 4, value: 'Shift' },
    ];

    public virtualKeysRow5: VirtualKey[] = [
        { id: 'key-54', row: 5, value: 'Space' },
    ];

    constructor() {
        effect(() => {
            if(this.isCapsLock()) {
                this.isShift.set(false);
            }
        });
        effect(() => {
            if(this.isShift()) {
                this.isCapsLock.set(false);
            }
        });
    }

    getDisplayKey(key: VirtualKey): string {
        if (typeof key === 'string') return key;

        if (this.isShift() || this.isCapsLock()) {
            if (key.shift) return key.shift;
            return key.value.toUpperCase();
        }
        return key.value;
    }

    handleKeyPress(key: string) {
        const inputValue = this.typedValue.controls.input;
        switch (key) {
            case 'Backspace':
                if(!inputValue.value || inputValue.value.length === 0) return;
                inputValue.patchValue(inputValue.value.slice(0, -1));
                break;
            case 'Space':
                if(inputValue.value) {
                    inputValue.patchValue(inputValue.value + ' ');
                }
                break;
            case 'Shift':
                this.isShift.set(!this.isShift());
                return; // Don't emit on shift
            case 'CapsLock':
                this.isCapsLock.set(!this.isCapsLock());
                this.isShift.set(false);
                return; // Don't emit on caps lock
            // case 'Enter':
            //     this.inputValue += '\n';
            //     break;
            // case 'Tab':
            //     this.inputValue += '\t';
            //     break;
            default: {
                const toUpperCase = this.isShift() || this.isCapsLock();
                inputValue.patchValue(inputValue.value + (toUpperCase ? key.toUpperCase() : key.toLowerCase()));

                // Turn off shift after key press (but not caps lock)
                if (this.isShift() && !this.isCapsLock()) {
                    this.isShift.set(false);
                }
                break;
            }
        }
        if(inputValue.value) {
            this.valueChange.emit(inputValue.value);
        }
    }
}
