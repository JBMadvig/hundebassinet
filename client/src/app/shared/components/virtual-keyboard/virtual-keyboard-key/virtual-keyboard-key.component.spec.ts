import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualKeyboardKeyComponent } from './virtual-keyboard-key.component';

describe('VirtualKeyboardKeyComponent', () => {
  let component: VirtualKeyboardKeyComponent;
  let fixture: ComponentFixture<VirtualKeyboardKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualKeyboardKeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualKeyboardKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
