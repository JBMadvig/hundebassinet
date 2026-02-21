import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualKey } from '../types/key.types';
import { VirtualKeyboardKeyComponent } from './virtual-keyboard-key.component';

describe('VirtualKeyboardKeyComponent', () => {
    let component: VirtualKeyboardKeyComponent;
    let fixture: ComponentFixture<VirtualKeyboardKeyComponent>;

    const mockKey: VirtualKey = { id: 'key-a', value: 'a', row: 1 };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VirtualKeyboardKeyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(VirtualKeyboardKeyComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('key', mockKey);
        fixture.componentRef.setInput('isShift', false);
        fixture.componentRef.setInput('isCapsLock', false);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
